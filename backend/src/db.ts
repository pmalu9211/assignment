import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  dishId: {
    type: Number,
    required: true,
    unique: true,
  },
  dishName: String,
  imageUrl: String,
  isPublished: Boolean,
});

export const Dish = mongoose.model("Dish", dishSchema);
