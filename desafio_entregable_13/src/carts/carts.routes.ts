import express from "express";
import { authToken } from "../utils/jwt.ts";
import CartsController from "./carts.controller.ts";
import { authPolicies } from "../utils.ts";

const Router = express.Router();

Router.post("/", CartsController.createCart);

Router.get("/", CartsController.getCarts);

Router.get("/:cid", CartsController.getCartById);

Router.post("/:cid", CartsController.addArrayOfProducts);

Router.delete("/:cid", CartsController.emptyCart);

Router.post(
  "/:cid/product/:pid",
  authToken,
  authPolicies("USER", "PREMIUM"),
  CartsController.addProductToCart
);

Router.post("/:cid/purchase", CartsController.purchaseCart);

Router.put("/:cid/product/:pid", CartsController.updateProductQuantity);

Router.delete("/:cid/product/:pid", CartsController.deleteOneProduct);

export default Router;
