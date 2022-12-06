import express from "express";
import dotenv from "dotenv";
import productManagerRouter from "../routes/ProductsManager.js";
import cartManagerRouter from "../routes/CartsManager.js";

const process = dotenv.config().parsed;
const { PORT } = process;

const app = express();
const port = PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", productManagerRouter);
app.use("/api/products/:pid", productManagerRouter);

app.use("/api/carts/", cartManagerRouter);
app.use("/api/carts/:cid", cartManagerRouter);
app.use("/api/carts/:cid/product/:pid", cartManagerRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
