import wishlistModel from "../../../db/models/wishlist.model.js";
import productModel from "../../../db/models/product.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";


//  /product/productid/wishlist   === orr user/userid/wishlist  (di lw imbeded y3ni l wishlist gowa l user model ) l etnin s7

// =======================  Create wishlist ========================
export const createWishlist = catchAsyncError(async (req, res, next) => {

  const { productId } = req.params
  const product= await productModel.findOne({ _id:productId })

  
  if(!product){
    return next(new AppError('product not exist',404))
  }

  const wishlist = await wishlistModel.findOne({user:req.user._id})

  if(!wishlist){
    const newWishlist = await wishlistModel.create({
      user:req.user._id,
      products:[productId]
    })
    return res.status(201).json({msg:"done" , wishlist:newWishlist})
  }
  const newWishlist=  await wishlistModel.findOneAndUpdate({user:req.user._id} ,{
      $addToSet:{products:productId}
    }, {
      new:true
    })
  
    res.status(200).json({msg:"done" , newWishlist})

})

//=======================  remove item from cart ========================
// export const removeWishlist = catchAsyncError(async (req, res, next) => {
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


//=======================  clear wishlist ========================
export const clearWishlist = catchAsyncError(async (req, res, next) => {

  const wishlistExist = await wishlistModel.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      products:[], 
    },
    {
      new: true,
    });

    res.status(200).json({msg:"done" , wishlist:wishlistExist})
});
