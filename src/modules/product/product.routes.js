import { Router } from "express";
import * as PC from "./product.controller.js";
import * as PV from "./product.validation.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
import reviewRouter from "../review/review.routes.js";
import wishlistRouter from "../wishlist/wishlist.routes.js";

const productRouter = Router({mergeParams:true});

productRouter.use('/:productId/wishlist' , wishlistRouter)
productRouter.use('/:productId/review' , reviewRouter)


productRouter.post(
  "/",
  multerHost(validExtensions.image).fields([
    {name:"image" , maxCount:1},  //return [{}]
    {name:"coverImages" , maxCount:3}  //return [{} , {} , {}]
  ]),
  validation(PV.createProduct),
  auth([systemRoles.admin]),
  PC.createProduct
);

productRouter.get(
  "/",
  validation(PV.getProducts),
  auth(Object.values(systemRoles)),
  PC.getProducts
);


productRouter.put(
  "/:id",
  validation(PV.updateProduct),
  multerHost(validExtensions.image).fields([
    {name:"image" , maxCount:1},  //return [{}]
    {name:"coverImages" , maxCount:3}  //return [{} , {} , {}]
  ]),
  auth([systemRoles.admin]),
  PC.updateProduct
);



export default productRouter;
