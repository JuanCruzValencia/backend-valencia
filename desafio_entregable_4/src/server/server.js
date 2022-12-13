import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "../utils_dirname.js";
import { PORT } from "../const/port.js";
import ProductRouter from "../routes/ProductsRouter.js";
import CartRouter from "../routes/CartRouter.js";
import ViewsRouter from "../routes/views.router.js";

const app = express();

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// html public folder setup
app.use(express.static(__dirname + "/public"));

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes path setup
app.use("/api/products", ProductRouter);
app.use("/api/products/:pid", ProductRouter);

// cart routes
app.use("/api/carts", CartRouter);
app.use("/api/carts/:cid", CartRouter);
app.use("/api/carts/:cid/products/:pid", CartRouter);

// views routes
app.use("/", ViewsRouter);

// app server uo
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
