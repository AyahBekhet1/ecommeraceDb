import { Router } from "express";
import * as WC from "./wishlist.controller.js";
import * as WV from "./wishlist.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const wishlistRouter = Router({mergeParams:true});

wishlistRouter.post(
  "/",
  validation(WV.createWishlist),
  auth(Object.values(systemRoles)),
  WC.createWishlist
);

// wishlistRouter.patch(
//   "/",
//   validation(CV.removewishlist),
//   auth(Object.values(systemRoles)),
//   CC.removewishlist
// );

wishlistRouter.put(
  "/",
  validation(WV.clearWishlist),
  auth(Object.values(systemRoles)),
  WC.clearWishlist
);

export default wishlistRouter;
