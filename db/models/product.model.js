import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 60,
      trim: true,
      unique: true,
      lowercase: true,
    },

    slug: {
      type: String,
      minLength: 3,
      maxLength: 60,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      minLength: 3,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImages :[
      {
        secure_url: String,
        public_id: String,
      }
    ],
    category:{
      type:Types.ObjectId,
      ref:"category",
      required:true
    
    },
    subCategory:{
      type:Types.ObjectId,
      ref:"subCategory",
      required:true
    
    },
    brand:{
      type:Types.ObjectId,
      ref:"brand",
      required:true
    
    },
    customId:String,
    price:{
      type:Number,
      required:true,
      min:1
    },
    discount:{
      type:Number,
      default:1,
      min:1,
      max:100
    },
    subPrice:{
      type:Number,
      default:1
    },
    stock:{
      type:Number,
      default:1,
      required:true
    },
    rateAvg:{
      type:Number,
      default:0
    },
    rateNum:{    //3dad l nas eli 3mlt review
      type:Number,
      default:0
    },
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;