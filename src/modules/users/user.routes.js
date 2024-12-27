import { Router } from "express";
import * as UC from "./user.controller.js";


const userRouter =Router()


userRouter.post('/signup' , UC.signUp )
userRouter.post('/signin' , UC.signIn )
userRouter.get('/verifyEmail/:token' , UC.verifyEmail )
userRouter.get('/refreshToken/:refToken' , UC.refreshToken )
userRouter.patch('/sendCode' , UC.forgetPass )
userRouter.patch('/resetpassword' , UC.resetPass )

export default userRouter