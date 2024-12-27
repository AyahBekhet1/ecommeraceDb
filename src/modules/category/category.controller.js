import { nanoid } from "nanoid";

import categoryModel from "../../../db/models/category.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";

// =======================  Create Category ========================
export const createCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });

  if (categoryExist) next(new AppError("category already exist", 409));

  if (!req.file) {
    return next(new AppError("image is required", 404));
  }
  const customId = nanoid(5);
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `sulina/categories/${customId}`,
    }
  );

  req.filePath = `sulina/categories/${customId}`

  const category = await categoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { public_id, secure_url },
    createdBy: req.user._id,
    customId,
  });

  req.data = {
    model:categoryModel,
    id:category._id
  }


  return res.status(201).json({ msg: "done", category });
});

// =======================  Update Category ========================
export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findOne({_id:id , createdBy:req.user._id});

  if (!category) next(new AppError("category not exist", 409));

  if (name) {
    if (name.toLowerCase() == category.name) {
      return next(new AppError("name should be different", 409));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("name already exist", 409));
    }

    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path, {
        folder: `sulina/categories/${category.customId}`,
      });
      category.image = { public_id, secure_url }
  }

  await category.save()

  return res.status(200).json({ msg: "done", category });
});


// =======================  get Categories with subcategories for each category ========================

export const getCategories = catchAsyncError(async (req, res, next) => {

  //virtual populate
  const categories = await categoryModel.find({}).populate([{ path: "subCategories" }]); //[]
  // let list =[]
  // if (!categories) next(new AppError("Categories not exist", 409));

  
  // for (const category of categories) {  // type pason gaia mnn l db mynf3sh azwed 3liha 7aga
  //   const subCategories = await subCategoryModel.find({category:category._id})
  //   const newCategory = category.toObject()  // i convert category (bason) to object js
  //   newCategory.subCategories = subCategories
  //   list.push(newCategory)
  // }


  
  return res.status(201).json({ msg: "done", categories });
});
// =======================  delete Categories  ========================

export const deleteCategory = catchAsyncError(async (req, res, next) => {

  const {id} = req.params
  const category = await categoryModel.findOneAndDelete({_id:id , createdBy:req.user._id})
 
if(!category){
  return next(new AppError('category not exist' ,401))
}

//delete subcategories related with this category
 await subCategoryModel.deleteMany({category:category._id})

 
 await cloudinary.api.delete_resources_by_prefix(`sulina/categories/${category.customId}`)
 await cloudinary.api.delete_folder(`sulina/categories/${category.customId}`)
  
  return res.status(201).json({ msg: "done" });
});