import mongoose, { Types } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    comment:{
      type:String , 
      required:[true , "comment is required"],
      minLength:3 ,
      trim:true
    },
    rate:{
      type:Number,
      required:true,
      min:1,
      max:5
    },
    productId:{
      type: Types.ObjectId,
      ref: "product",
      required:true
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = mongoose.model("review", reviewSchema);

export default reviewModel;
