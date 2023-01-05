import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";
import __dirname from "./utils.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartRouter.js";

// variables de entorno y servidor
const process = dotenv.config().parsed;
const { PORT, MONGOOSE_URI } = process;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// mongoose
mongoose.set("strictQuery", false);
mongoose.connect(MONGOOSE_URI, (error) => {
  if (error) {
    console.log("Unable to connect");
    return;
  }

  console.log("Mongoose database connected");
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});
