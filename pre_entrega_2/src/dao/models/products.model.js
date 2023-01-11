import mongoose, { mongo } from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: {
    type: [String],
    default: [],
  },
});

const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;
