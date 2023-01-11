import mongoose from "mongoose";

const cartsCollections = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
  },
});

cartSchema.pre("find", () => {
  this.populate("products.product");
});

const cartsModel = mongoose.model(cartsCollections, cartSchema);

export default cartsModel;
