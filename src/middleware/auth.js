import jwt from "jsonwebtoken";
import userModel from "../../db/models/user.model.js";
import { AppError } from "../utils/classError.js";
import { catchAsyncError } from "../utils/asyncHandler.js";

//l auth btkon abl l authorization
export const auth = (roles = []) => {
  return catchAsyncError(async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        throw new AppError("you have to login first", 400);
      }

      
      const decoded = jwt.verify(token, process.env.SIGNATUREKEY);
      if (!decoded?.email) {
        return res.status(400).json({ msg: "invalid token payload" });
      }
     
      const user = await userModel.findOne({ email: decoded.email });
      if (!user) {
        return res.status(409).json({ msg: "user not exist" });
      }

      if (parseInt(user.passwordChangedAt?.getTime() / 1000) > decoded.iat) {
        return res
          .status(400)
          .json({ msg: "password changed please login again" });
      }

      
      //authorization
      if (!roles.includes(user.role)) {
        return res.status(401).json({ msg: "you are not authorized" }); //AppError("you don't have permission", 401);
      }
      req.user = user;
      next();

     // console.log(decoded.iat)  //l wa2t eli l token 7slo create
      
    } catch (error) {
      return res.status(400).json({ msg: "catch error in auth" });
    }
  });
};
