import userModel from "../../../db/models/user.model.js";
import { catchAsyncError } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { sendEmail } from "../../service/sendEmail.js";

import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

// ==========================  SignUp  ==========================
export const signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password, age, cPassword, phone, address , role} = req.body;

  const userExist = await userModel.findOne({ email: email.toLowerCase() });
  userExist && next(new AppError("user already exist", 409));

  const token = jwt.sign({ email }, process.env.SIGNATUREKEY, {
    expiresIn: 60*5,
  });
  const link = `${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`;

  const refToken = jwt.sign({ email }, process.env.SIGNATUREKEYREF);
  const refLink = `${req.protocol}://${req.headers.host}/user/refreshToken/${refToken}`;

  await sendEmail(
    email,
    "verify your Email",
    `<a href="${link}">click here to verify your email</a> <br>
        <a href="${refLink}">click here to resend another link </a>`
  );

  const hash = bcrypt.hashSync(password, 10);

  const user = new userModel({
    name,
    email,
    password: hash,
    cPassword,
    age,
    phone,
    address,
    role
  });

  const newUser = await user.save();

  newUser
    ? res.status(200).json({ msg: "done", user: newUser })
    : next(new AppError("failed to create", 400));
});

// ==========================  Verify Email ==========================
export const verifyEmail = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.SIGNATUREKEY);

  if (!decoded?.email) return next(new AppError("invalid Token", 400));

  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );

  user
    ? res.status(200).json({ msg: "done" })
    : next(new AppError("user not exist or already confirmed", 400));
});



// ==========================  Refresh Token ==========================
export const refreshToken = catchAsyncError(async (req, res, next) => {
  const { refToken } = req.params;
  const decoded = jwt.verify(refToken, process.env.SIGNATUREKEYREF);

  if (!decoded?.email) return next(new AppError("invalid Token", 400));


  const user = await userModel.findOne({email:decoded.email , confirmed:true})

  if(user){
    return next(new AppError('user already confirmed ' , 400))
  }

  const token = jwt.sign({ email:decoded.email }, process.env.SIGNATUREKEY, {
    expiresIn:60*5,
  });
  const link = `${req.protocol}://${req.headers.host}/user/verifyEmail/${token}`;

  await sendEmail(
    decoded.email,
    "verify your Email",
    `<a href="${link}">click here to verify your email</a>`);

  res.status(200).json({ msg: "done" });
});




// ========================== Forget Password ==========================
export const forgetPass = catchAsyncError(async(req, res , next)=>{

    const {email} = req.body

    const user = await userModel.findOne({email : email.toLowerCase()})
    console.log(user.email);
    
    if(!user){
        return next(new AppError('user not exist') , 404)
    }

    const code = nanoid(5)

    await sendEmail(email ,"Code for reset password" , `<h1>Your code is ${code} </h1>`)

    await userModel.updateOne({email} , {code})

    res.status(200).json({msg:"done"})
})



// ========================== reset Password ==========================
export const resetPass = catchAsyncError(async(req, res , next)=>{
    const {email , code ,password } = req.body

    const user = await userModel.findOne({email : email.toLowerCase()})
    if(!user)  return next(new AppError('user not exist',404))
    

    if(user.code != code || code =='') return next(new AppError('invalid code' , 400))
    

    
    const hash = bcrypt.hashSync(password , +process.env.saltRounds)

    await userModel.updateOne({email} , {password:hash, code:"" , passwordChangedAt:Date.now()})

    res.status(200).json({msg:"done"})
})


// ========================== sign in ==========================
export const signIn = catchAsyncError(async(req, res , next)=>{
    const {email  ,password } = req.body

    const user = await userModel.findOne({email : email.toLowerCase() , confirmed:true})

    if(!user)  return next(new AppError('user not exist',404))

    if(!bcrypt.compareSync(password , user.password))  return next(new AppError('invalid password',404))

    const token =jwt.sign({email , role:user.role} , process.env.SIGNATUREKEY)


    
    await userModel.updateOne({email} , {loggedIn:true})

    res.status(200).json({msg:"done" , token})
})


