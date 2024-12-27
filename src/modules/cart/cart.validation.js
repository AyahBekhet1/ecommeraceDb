import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createCart = {
  body: Joi.object({
    productId:generalFiled.id.required(),
    quantity:Joi.number().integer().required()

  }).required(),
  headers: generalFiled.headers.required(),
};


export const removeCart = {
  body: Joi.object({
    productId:generalFiled.id.required(),


  }).required(),
  headers: generalFiled.headers.required(),
};

export const clearCart = {
  
  headers: generalFiled.headers.required(),
};




