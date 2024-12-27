import mongoose, { Types } from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    products:[{
      type: Types.ObjectId,
      ref: "product" ,
      required:true, 
    }],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

export default wishlistModel;
