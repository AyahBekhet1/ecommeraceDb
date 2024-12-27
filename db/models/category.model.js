import mongoose, { Types } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
      lowercase: true,
    },

    slug: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
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
    customId:{
      type:String
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }
);

//3mlt feild wahmy ylef 3l subCategory
// mmkn a3ml kaza virtual
//nested virtual fl subCategory w ageb m3lomat l product
categorySchema.virtual('subCategories' ,{
  ref:'subCategory',
  localField:"_id",
  foreignField:"category"
})

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
