import orderModel from "../../../db/models/order.model.js";
import couponModel from "../../../db/models/coupon.model.js";
import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { createInvoice } from "../../utils/pdf.js";
import {sendEmail} from '../../service/sendEmail.js'
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";
// =======================  Create order ========================
export const createOrder = catchAsyncError(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } =
    req.body;

  //check if coupon valid
  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode.toLowerCase(),
      usedBy:{$nin:[req.user._id]}
    });
    if (!coupon || coupon.toDate < Date.now()) {
      return next(new AppError("coupon not exist or expired", 404));
    }
    req.body.coupon = coupon;
  }


  //order b product b 3eno
  let products =[]
  let flag = false
  if (productId) {
    //check if product exist
    const product = await productModel.findOne({ _id: productId,stock: { $gte: quantity },});
    if (!product) {
      return next(new AppError("product not exist or out of stock", 409));
    }

    products = [{productId , quantity , discount : product.discount }]
    
  }
  //order ll 7gat eli fl cart
  else{
    const cart = await cartModel.findOne({user:req.user._id})
    if(!cart.products.length){
      
      return next(new AppError('cart is empty' ,404))
    }else{
      products= cart.products   //products hna rag3a mn l database 7tb2a bson la yakbal enna nzwed 3leh lakn yakbal l ta3del 3ala eli gowah
      flag=true
    }
  }

  let finalProducts =[]
  let subPrice =0
  for (let product of products) {
  const checkProduct = await productModel.findOne({_id: product.productId,stock: { $gte: product.quantity }});
  if (!checkProduct){
    return  next(new AppError("product not exist or out of stock", 409));
  }

  if(flag){
    product=product.toObject()
  }

  product.discount = checkProduct.discount
  product.title = checkProduct.title
  product.price = checkProduct.price
  product.finalPrice =checkProduct.subPrice *product.quantity    //subPrice after discount
  subPrice += product.finalPrice 
  finalProducts.push(product)


  }

  const order = await orderModel.create({
    user:req.user._id , 
    products:finalProducts,
    subPrice,
    couponId: req.body.coupon?._id,
    totalPrice:(subPrice - subPrice*((req.body.coupon?.amount || 0) /100)),
    address,
    phone,
    paymentMethod,
    status:paymentMethod == "cash"?"placed" : "waitPayment"

  })

  await order.save()

  if(req.body?.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id} , {
      $push:{usedBy:req.user._id}
    })
  }

  for (const product of finalProducts) {
    await productModel.findByIdAndUpdate({_id:product.productId} , {
      $inc:{stock:-product.quantity}
    })
  }

  if(flag){
    await cartModel.updateOne({user:req.user._id} ,{products:[]} )
  }



//   const invoice = {
//     shipping: {
//       name: req.user.name,
//       address: req.user.address,
//       city: "Egypt",
//       country: "Cairo",
//       postal_code: 94111
//     },
//     items: order.products ,
//     subtotal:order.subPrice,
//     paid: order.totalPrice,
//     invoice_nr: order._id,
//     date:order.createdAt,
//     coupon:req.body.coupon?.amount || 0
//   };
  


// await  createInvoice(invoice, `${req.user.name}.pdf`);

// await sendEmail(req.user.email , "order placed" , 'your order has been placed successfully' ,[
//   {
//     path:`${req.user.name}.pdf`,
//     contentType:"application/pdf"
//   },
//   {
//     path:"images.jpeg",
//     contentType:"image/jpeg"
//   }
// ])

if(paymentMethod == 'card'){
  const stripe = new Stripe(process.env.stripe_secret)

  if(req.body?.coupon){
    const coupon = await stripe.coupons.create({
      percent_off:req.body.coupon.amount,
      duration:"once"
    })
    req.body.couponId = coupon.id
  }
  const session = await payment({
    stripe,
    payment_method_types:["card"],
    mode:"payment",
    customer_email:req.user.email,
    metadata:{
      orderId:order._id.toString()
    },
    success_url:`${req.protocol}://${req.headers.host}/order/success/${order._id}`,
    cancel_url:`${req.protocol}://${req.headers.host}/order/cancel$/${order._id}`,
    line_items:order.products.map((product)=>{
      return{
        price_data:{
            currency:"egp",
            product_data:{
                name:product.title
            },
            unit_amount:product.price*100  //900.00
        },
        quantity:product.quantity,

    }
    }),
    discounts:req.body?.coupon?[{coupon : req.body.couponId}]:[]
  })
  return res.status(201).json({ msg: "done", url :session.url  });

}


  return res.status(201).json({ msg: "done", order });


});

//=======================  remove item from cart ========================
// export const removeCart = catchAsyncError(async (req, res, next) => {
//   const { productId } = req.body;

//   const cartExist = await cartModel.findOneAndUpdate(
//     {
//       user: req.user._id,
//       "products.productId": productId, //7y3ml loop 3l productId w yshuf l product id da mwgod fl products wla la
//     },
//     {
//       $pull: { products: { productId } },  // pull bys7b l id da mn l array bt3ti
//     },
//     {
//       new: true,
//     });

//     res.status(200).json({msg:"done" , cart:cartExist})
// });

//=======================  clear cart ========================
// export const clearCart = catchAsyncError(async (req, res, next) => {

//   const cartExist = await cartModel.findOneAndUpdate(
//     {
//       user: req.user._id,
//     },
//     {
//       products:[],
//     },
//     {
//       new: true,
//     });

//     res.status(200).json({msg:"done" , cart:cartExist})
// });



//========================== cancel order =======================

export const cancelOrder = catchAsyncError (async (req,res,next)=>{
  const {id} = req.params
  const {reason} = req.body
  const order = await orderModel.findOne({_id:id , user:req.user._id})
  if(!order){
    return next(new AppError('order not found' , 404))
  }

  if((order.paymentMethod === 'cash'  && order.status !== 'placed') ||
  (order.paymentMethod === 'card'  && order.status !== 'waitPayment')){
    return next(new AppError('you cant cancel this order' , 400))
  }

  await orderModel.updateOne({_id:id} , {
    status:"cancelled",
    canceledBy:req.user._id,
    reason
  })


  if(order?.couponId){
    await couponModel.updateOne({_id:order.couponId} , {
      $pull:{usedBy:req.user._id}
    })
  }

  for (const product of order.products) {
    await productModel.findByIdAndUpdate({_id:product.productId} , {
      $inc:{stock:product.quantity}
    })
  }

  res.status(200).json({msg:"done"})
})

//////////////////////////////webhook////////////////////////////

export const webhook = catchAsyncError(async(req, res , next) => {
  const stripe = new Stripe(process.env.stripe_secret)
  let event = req.body;
 
  if (process.env.endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.endpointSecret
      );
    } catch (err) {
     res.status(400).send(`webhook error ${err.message}`)
     return
    }
  }

  // Handle the event
  if (event.type !== "checkout.session.completed") {
    await orderModel.updateOne({_id:event.data.object.metadata.orderId} , {status:"rejected"})

    return res.status(400).json({msg:"fail"})
  }else{
    await orderModel.updateOne({_id:event.data.object.metadata.orderId} , {status:"placed"})

    return res.status(200).json({msg:"done"})
  }
})