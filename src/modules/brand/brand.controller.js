import { nanoid } from "nanoid";

import brandModel from "../../../db/models/brand.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../../../db/models/category.model.js";

// =======================  Create brand ========================
export const createBrand = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  
  const brandExist = await brandModel.findOne({
    name: name.toLowerCase(),
  });

  if (brandExist) next(new AppError("brand already exist", 409));

  if (!req.file) {
    return next(new AppError("image is required", 404));
  }

  const customId = nanoid(5)
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `sulina/brands/${customId}`,
    }
  );

  const brand = await brandModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    createdBy: req.user._id,
    customId,
  });

  return res.status(201).json({ msg: "done", brand });
});

// =======================  Update Category ========================
// export const updateCategory = catchAsyncError(async (req, res, next) => {
//   const { name } = req.body;
//   const { id } = req.params;

//   const category = await categoryModel.findOne({_id:id , createdBy:req.user._id});

//   if (!category) next(new AppError("category not exist", 409));

//   if (name) {
//     if (name.toLowerCase() == category.name) {
//       return next(new AppError("name should be different", 409));
//     }
//     if (await categoryModel.findOne({ name: name.toLowerCase() })) {
//       return next(new AppError("name already exist", 409));
//     }

//     category.name = name.toLowerCase();
//     category.slug = slugify(name, {
//       replacement: "_",
//       lower: true,
//     });
//   }

//   if (req.file) {
//     await cloudinary.uploader.destroy(category.image.public_id);
//     const { public_id, secure_url } = await cloudinary.uploader.upload(
//       req.file.path, {
//         folder: `sulina/categories/${category.customId}`,
//       });
//       category.image = { public_id, secure_url }
//   }

//   await category.save()

//   return res.status(200).json({ msg: "done", category });
// });
