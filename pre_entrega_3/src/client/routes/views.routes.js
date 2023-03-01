import express from "express";
import {
  getAllProducts,
  getCartPage,
  getErrorPage,
  getOneProduct,
} from "../controllers/views.controller.js";
import { passportCall } from "../../utils/jwt.js";

const Router = express.Router();

Router.get("/products", passportCall("jwt"), getAllProducts);

Router.get("/products/:pid", passportCall("jwt"), getOneProduct);

Router.get("/error", getErrorPage);

Router.get("carts/:cid", getCartPage); //Si no hay carrito que se renderize una alternativa

Router.get("/admin"); //admin por ahora no tiene una vista

export default Router;
