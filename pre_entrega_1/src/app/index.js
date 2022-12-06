import { ProductManager } from "./app.js";
import dotenv from "dotenv";

const process = dotenv.config().parsed;
const { PRODUCTS_PATH, CART_PATH } = process;

export const ProductsManager = new ProductManager(PRODUCTS_PATH);
export const CartManager = new ProductManager(CART_PATH);
