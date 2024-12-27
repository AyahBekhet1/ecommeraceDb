import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createReview = {
  body: Joi.object({
    comment: Joi.string().required(),
    rate:Joi.number().min(1).max(5).integer().required() ,

  }),
  params:Joi.object({
    productId:generalFiled.id.required()
  }),
  headers: generalFiled.headers.required(),
};


export const deleteReview = {
  params:Joi.object({
    id:generalFiled.id.required(),
    productId:generalFiled.id.required()

  }),
  headers: generalFiled.headers.required(),
};




