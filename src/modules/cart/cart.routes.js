import { Router } from "express";
import * as CC from "./cart.controller.js";
import * as CV from "./cart.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = Router();

cartRouter.post(
  "/",
  validation(CV.createCart),
  auth(Object.values(systemRoles)),
  CC.createCart
);

cartRouter.patch(
  "/",
  validation(CV.removeCart),
  auth(Object.values(systemRoles)),
  CC.removeCart
);

cartRouter.put(
  "/",
  validation(CV.clearCart),
  auth(Object.values(systemRoles)),
  CC.clearCart
);

export default cartRouter;
