import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    products:[{
      title:{type:String , required:true},
      productId:{type: Types.ObjectId,ref: "product" , required:true},
     quantity:{type:Number , required:true} ,
     price:{type :Number , required:true},
     finalPrice:{type :Number , required:true},
     discount:{type:Number}
    }],

    subPrice:{type:Number , required:true},  ///total l order bdon discount l coupon
    couponId:{type:Types.ObjectId , ref:"coupon"},
    totalPrice: {type:Number , required:true},  ///total b3d discount l coupon
    address :{type:String , required:true},
    phone :{type:String , required:true},
    paymentMethod:{
      type:String , 
      required:true , 
      enum:['cash' , "card"]
    },
    status:{
      type:String,
      enum:['placed' , 'waitPayment' , 'delivered' , 'onWay' , 'cancelled' , 'rejected'],
      default:'placed'
    },
    canceledBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    reason:{type:String}
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
