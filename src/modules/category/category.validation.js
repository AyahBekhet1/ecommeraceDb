import Joi from "joi";
import { generalFiled } from "../../utils/generalFields.js";

export const createCategory ={
    body:Joi.object({
        name:Joi.string().min(3).max(30).required()
    }).required(),
    file: generalFiled.file.required(),
    headers:generalFiled.headers.required()
}
export const updateCategory ={
    body:Joi.object({
        name:Joi.string().min(3).max(30)
    }).required(),
    file: generalFiled.file,
    headers:generalFiled.headers.required()
}