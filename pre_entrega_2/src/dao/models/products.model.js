import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products";

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

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;
