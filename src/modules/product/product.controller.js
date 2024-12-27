import { nanoid } from "nanoid";

import productModel from "../../../db/models/product.model.js";
import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import brandModel from "../../../db/models/brand.model.js";

import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { ApiFeatures } from "../../utils/apiFeatures.js";

// =======================  Create product ========================
export const createProduct = catchAsyncError(async (req, res, next) => {
  const {
    title,
    description,
    price,
    discount,
    brand,
    category,
    subCategory,
    stock,
  } = req.body;

  //check if product exist
  const productExist = await productModel.findOne({
    title: title.toLowerCase(),
  });
  if (productExist) next(new AppError("product already exist", 404));

  //check if category exist
  const categoryExist = await categoryModel.findOne({
    _id: category,
  });
  if (!categoryExist) next(new AppError("category not exist", 404));

  //check if subCategory exist
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) next(new AppError("subCategory not exist", 404));

  //check if brand exist
  const brandExist = await brandModel.findOne({
    _id: brand,
  });
  if (!brandExist) {
    return next(new AppError("brand not exist", 404));
  }

  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) {
    return next(new AppError("images are required", 404));
  }

  const customId = nanoid(5);
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `sulina/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/coverImages`,
      }
    );
    list.push({ secure_url, public_id });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `sulina/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/mainImage`,
    }
  );
  const product = await productModel.create({
    title,
    slug: slugify(title, {
      replacement: "_",
      lower: true,
    }),
    description,
    price,
    discount,
    subPrice,
    stock,
    category,
    subCategory,
    brand,
    image: { secure_url, public_id },
    coverImages: list,
    customId,
    createdBy: req.user._id,
  });

  return res.status(201).json({ msg: "done", product });
});

// =======================  get products ========================

export const getProducts = catchAsyncError(async (req, res, next) => {
const apiFeature = new ApiFeatures(productModel.find() , req.query)
.pagination()
.filter()
.search()
.sort()
.select()

const products =await apiFeature.mongooseQuery

  return res.status(201).json({ msg: "done", paga:apiFeature.page , products });
});

//=======================  Update Product ========================
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const {
    title,
    description,
    price,
    discount,
    brand,
    category,
    subCategory,
    stock,
  } = req.body;
  
  const { id } = req.params;

  //check if product exist
  

  //check if category exist
  const categoryExist = await categoryModel.findOne({
    _id: category,
  });
  if (!categoryExist) next(new AppError("category not exist", 404));

  //check if subCategory exist
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) next(new AppError("subCategory not exist", 404));

  //check if brand exist
  const brandExist = await brandModel.findOne({
    _id: brand,
  });
  if (!brandExist) {
    return next(new AppError("brand not exist", 404));
  }

  const product = await productModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!product) next(new AppError("product not exist", 404));

  if (title) {
    if (title.toLowerCase() == product.title) {
      return next(new AppError("title should be different", 409));
    }
    if (await productModel.findOne({ title: title.toLowerCase() })) {
      return next(new AppError("title already exist", 409));
    }

    product.title = title.toLowerCase();
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }

  if (description) {
    product.description = description;
  }
  if (stock) {
    product.stock = stock;
  }

  // l tarteb mohm
  if (price & discount) {
    product.subPrice = price - price * (discount / 100);
    product.price=price
    product.discount=discount
  } else if (price) {
    product.subPrice = price - price * (product.discount / 100);
    product.price=price
  } else if (discount){
    product.subPrice = product.price - (product.price * (discount/100))
    product.discount = discount
  }





  if (req.files) {
    if(req.files?.image?.length){ ///b3ml updatet ll sora eli lw7dha
      await cloudinary.uploader.destroy(product.image.public_id)
      const {secure_url ,public_id } = await cloudinary.uploader.upload(req.files.image[0].path ,{
        folder:`sulina/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/mainImage`
      })
      product.image={secure_url,public_id}
    }

    if(req.files?.coverImages?.length){
      await cloudinary.api.delete_resources_by_prefix(`sulina/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`)
      let list =[]

      for (const file of req.files.coverImages) {
        const {secure_url , public_id} = await cloudinary.uploader.upload(file.path ,{
          folder:`sulina/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`
        })
        list.push({secure_url,public_id})
      }
      product.coverImages=list
    }
  }

  await product.save();

  return res.status(200).json({ msg: "done", product });
});
