import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createSubCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
  }).required(),
  params:Joi.object({
    categoryId:generalFiled.id.required()
  })  ,
  file: generalFiled.file.required(),
  headers: generalFiled.headers.required(),
};
export const updateSubCategory = {
  body: Joi.object({
    name: Joi.string().min(3).max(30),
  }).required(),
  file: generalFiled.file,
  headers: generalFiled.headers.required(),
};
