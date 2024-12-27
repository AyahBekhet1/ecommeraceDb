import mongoose, { Types } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
      lowercase: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount :{
      type:Number,
      required:[true , 'amount is required'],
      min :1,
      max:100
    },
    usedBy:[{
      type: Types.ObjectId,
      ref: "user",
    }],
    fromDate : {
      type:Date , 
      required:[true , 'from date is required']
    },
    toDate: {
      type:Date , 
      required:[true , 'to date is required']
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const couponModel = mongoose.model("coupon", couponSchema);

export default couponModel;
