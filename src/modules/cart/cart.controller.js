import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

// =======================  Create cart ========================
export const createCart = catchAsyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;

  //check if product exist
  const productExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!productExist)
    next(new AppError("product not exist or out of stock", 409));

  //check if cart exist
  const cartExist = await cartModel.findOne({ user: req.user._id });

  if (!cartExist) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(201).json({ msg: "done", cart });
  }

  let flag = false;

  for (const product of cartExist.products) {
    if (productId == product.productId) {
      if (quantity + product.quantity > productExist.stock) {
        return next(new AppError("product quantity exceed stock", 409));
      } else {
        product.quantity += quantity;

        flag = true;
      }
    }
  }

  if (!flag) {
    cartExist.products.push({ productId, quantity });
  }

  await cartExist.save();
  return res.status(201).json({ msg: "done", cart: cartExist });
});

//=======================  remove item from cart ========================
export const removeCart = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;

  const cartExist = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId, //7y3ml loop 3l productId w yshuf l product id da mwgod fl products wla la
    },
    {
      $pull: { products: { productId } },  // pull bys7b l id da mn l array bt3ti
    },
    {
      new: true,
    });

    res.status(200).json({msg:"done" , cart:cartExist})
});


//=======================  clear cart ========================
export const clearCart = catchAsyncError(async (req, res, next) => {

  const cartExist = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      products:[], 
    },
    {
      new: true,
    });

    res.status(200).json({msg:"done" , cart:cartExist})
});
