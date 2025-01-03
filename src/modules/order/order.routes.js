import express from "express";
import * as OC from "./order.controller.js";
import * as OV from "./order.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  validation(OV.createOrder),
  auth(Object.values(systemRoles)),
  OC.createOrder
);


orderRouter.put(
  "/:id",
  validation(OV.cancelOrder),
  auth(Object.values(systemRoles)),
  OC.cancelOrder
);


orderRouter.post('/webhook', express.raw({type: 'application/json'}), OC.webhook)

  
export default orderRouter
