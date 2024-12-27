import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(30).required(),
    stock:Joi.number().min(1).integer().required(),
    discount : Joi.number().min(1).max(100),
    price:Joi.number().min(1).integer().required(),
    brand:generalFiled.id.required(),
    subCategory:generalFiled.id.required(),
    category:generalFiled.id.required(),
    description:Joi.string()
  }).required(),

  files:Joi.object({
    image:Joi.array().items(generalFiled.file.required()).required(),
    coverImages:Joi.array().items(generalFiled.file.required()).required()
  }).required(),
  headers: generalFiled.headers.required(),
};


export const updateProduct = {
  body: Joi.object({
    title: Joi.string().min(3).max(30),
    stock:Joi.number().min(1).integer(),
    discount : Joi.number().min(1).max(100),
    price:Joi.number().min(1).integer(),
    brand:generalFiled.id.required(),
    subCategory:generalFiled.id.required(),
    category:generalFiled.id.required(),
    description:Joi.string()
  }),
  params:Joi.object({
    id:generalFiled.id.required()
  }),
  files:Joi.object({
    image:Joi.array().items(generalFiled.file),
    coverImages:Joi.array().items(generalFiled.file)
  }),
  headers: generalFiled.headers.required(),
};


export const getProducts = {
  query:Joi.object({
    page: Joi.number().integer().min(1).optional(),
    sort: Joi.string().optional(),
    search: Joi.string().optional(),
    select: Joi.string().optional(),
    gt: Joi.number().optional(),
    lt: Joi.number().optional(),
    gte: Joi.number().optional(),
    lte: Joi.number().optional(),
    eq: Joi.number().optional(),
  }).unknown(true),
  headers: generalFiled.headers.required(),
};
