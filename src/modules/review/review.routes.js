import { Router } from "express";
import * as RC from "./review.controller.js";
import * as RV from "./review.validation.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

const reviewRouter = Router({mergeParams:true});

reviewRouter.post(
  "/",
  validation(RV.createReview),
  auth(Object.values(systemRoles)),
  RC.createReview
);

reviewRouter.delete(
  "/:id",
  validation(RV.deleteReview),
  auth(Object.values(systemRoles)),
  RC.deleteReview
);




export default reviewRouter;
