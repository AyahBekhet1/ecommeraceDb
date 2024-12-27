import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createWishlist = {
  params:Joi.object({
    productId:generalFiled.id.required()
  }),
  headers: generalFiled.headers.required(),
};


// export const removeWishlist = {
//   body: Joi.object({
//     productId:generalFiled.id.required(),


//   }).required(),
//   headers: generalFiled.headers.required(),
// };

export const clearWishlist = {
  
  headers: generalFiled.headers.required(),
};



// params:Joi.object({
//   productId:generalFiled.id.required()
// }),
