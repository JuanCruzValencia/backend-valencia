import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartsCollections = "Carts";

const cartSchema = new Schema({
  cart: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: Number,
      },
    ],
  },
});

cartSchema.pre("find", () => {
  this.populate("cart.product");
});

const cartsModel = mongoose.model(cartsCollections, cartSchema);

export default cartsModel;
