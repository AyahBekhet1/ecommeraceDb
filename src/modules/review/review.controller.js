import reviewModel from "../../../db/models/review.model.js";
import productModel from "../../../db/models/product.model.js";
import orderModel from "../../../db/models/order.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

// =======================  Create coupon ========================
export const createReview = catchAsyncError(async (req, res, next) => {
  const { comment, rate } = req.body;
  const {productId} =req.params

  //check if product exist
  const product = await productModel.findById(productId)
  if(!product){
    return next(new AppError('product not found' , 404))
  }

  //check if review exist
  // const reviewExist = await reviewModel.findOne({createdBy: req.user._id, productId});
  // if (reviewExist) return next(new AppError("you already reviewed", 409));
  
  //check if order 
  const order =  await orderModel.findOne({
    user:req.user._id,
    "products.productId":productId,
    status:"delivered"
  })
  if (!order) return next(new AppError("you cant make review beacuse you didnt order this product ", 409));

  const review = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy: req.user._id,
  });

  // const reviews = await reviewModel.find({productId})

  // let sum=0
  // for (const review of reviews) {
  //   sum +=review.rate
  // }

  // product.rateAvg =  sum / reviews.length

  let sum=product.rateAvg * product.rateNum
  sum=sum+rate

  product.rateAvg = sum/(product.rateNum+1)
  product.rateNum+=1
  
  
  await product.save()

  return res.status(201).json({ msg: "done", review });
});

//=======================  delete review ========================
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  
  const review = await reviewModel.findOneAndDelete(
    { _id: id, createdBy: req.user._id }
  );

  if (!review)
  return  next(new AppError("review not exist or you dont have permission", 409));

  const product = await productModel.findById(review.productId)

  if(!product) return next(new AppError('product not found' , 404))

    let sum=product.rateAvg * product.rateNum
    sum=sum - review.rate
  
    product.rateAvg = sum/(product.rateNum-1)
    product.rateNum-=1

   await product.save()

  return res.status(200).json({ msg: "done" });
});
