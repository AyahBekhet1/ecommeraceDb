import { Router } from "express";
import * as CC from "./coupon.controller.js";
import * as CV from "./coupon.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const couponRouter = Router();

couponRouter.post(
  "/",
  validation(CV.createCoupon),
  auth([systemRoles.admin]),
  CC.createCoupon
);

couponRouter.put(
  "/:id",
  validation(CV.updateCoupon),
  auth([systemRoles.admin]),
  CC.updateCoupon
);




export default couponRouter;
