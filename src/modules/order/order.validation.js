import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createOrder = {
  body: Joi.object({
    productId:generalFiled.id,
    quantity:Joi.number().integer(),
    phone:Joi.string().required(),
    address:Joi.string().required(),
    couponCode:Joi.string().min(3),
    paymentMethod:Joi.string().valid("card" , "cash").required(),

  }).required(),
  headers: generalFiled.headers.required(),
};
export const cancelOrder = {
  body: Joi.object({
    reason:Joi.string(),
    

  }),
  params:Joi.object({
    id:generalFiled.id.required()
  }),
  headers: generalFiled.headers.required(),
};







