import couponModel from "../../../db/models/coupon.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";

// =======================  Create coupon ========================
export const createCoupon = catchAsyncError(async (req, res, next) => {
  const { code, amount, toDate, fromDate } = req.body;

  const couponExist = await couponModel.findOne({
    code: code.toLowerCase(),
  });



  if (couponExist) next(new AppError("coupon already exist", 409));

  const coupon = await couponModel.create({
    code,
    amount,
    toDate,
    fromDate,
    createdBy: req.user._id,
  });

  return res.status(201).json({ msg: "done", coupon });
});

//=======================  Update coupon ========================
export const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, toDate, fromDate } = req.body;
  
  const coupon = await couponModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      code,
      amount,
      fromDate,
      toDate,
    },
    {
      new: true,
    }
  );

  if (!coupon)
    next(new AppError("coupon not exist or you dont have permission", 409));

  // if (code) {
  //   if (code.toLowerCase() == coupon.code) {
  //     return next(new AppError("code should be different", 409));
  //   }
  //   if (await couponModel.findOne({ code: code.toLowerCase() })) {
  //     return next(new AppError("code already exist", 409));
  //   }

  // }

  // await coupon.save()

  return res.status(200).json({ msg: "done", coupon });
});
