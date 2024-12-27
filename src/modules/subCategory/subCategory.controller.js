import { nanoid } from "nanoid";

import subCategoryModel from "../../../db/models/subCategory.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../../../db/models/category.model.js";

// =======================  Create subCategory ========================
export const createSubCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findById(req.params.categoryId);

  if (!categoryExist) next(new AppError("Category not exist", 409));

  const subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });

  if (subCategoryExist) next(new AppError("subCategory already exist", 409));

  if (!req.file) {
    return next(new AppError("image is required", 404));
  }

  const customId = nanoid(5)
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `sulina/categories/${categoryExist.customId}/subCategories/${customId}`,
    }
  );

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    createdBy: req.user._id,
    category:req.params.categoryId,
    customId,
  });

  return res.status(201).json({ msg: "done", subCategory });
});


// =======================  get subCategory ========================

export const getSubCategories = catchAsyncError(async (req, res, next) => {



  const subCategoriesExist = await subCategoryModel.findOne({}).populate([
    {
      path:"category",
      select :"name -_id"
    },
    {
      path:"createdBy",
      select:"name -_id"
    }
  ]);

  if (!subCategoriesExist) next(new AppError("subCategories not exist", 409));

  
  return res.status(201).json({ msg: "done", subCategoriesExist });
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


