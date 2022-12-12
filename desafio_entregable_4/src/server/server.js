
// app.get("/", (req, res) => {
//   const user = {
//     name: "Juan Cruz",
//     lastName: "Valencia",
//   };

//   res.render("index", user);
// });

// const foods = [
//   {
//     name: "burga",
//     price: 200,
//   },
//   {
//     name: "pizza",
//     price: 230,
//   },
//   {
//     name: "ice cream",
//     price: 150,
//   },
// ];

// const newUser = {
//   name: "Juan",
//   lastName: "Valencia",
//   role: "admin",
// };

// app.get("/food", (req, res) => {
//   res.render("food", {
//     style: "style.css",
//     user: newUser,
//     isAdmin: newUser.role === "admin",
//     foods,
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
// });

import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "../utils/index.js";
import { PORT } from "../const/port.js";
import ProductRouter from "../routes/ProductsRouter.js";
import CartRouter from "../routes/CartRouter.js";

const app = express();

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set(" view engine", "handlebars");

// html public folder setup
app.use(express.static(__dirname + "/public"));

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes path setup
app.use("/api/products", ProductRouter);
app.use("/api/products/:pid", ProductRouter);

app.use("/api/carts", CartRouter);
app.use("/api/carts/:cid", CartRouter);
app.use("/api/carts/:cid/products/:pid", CartRouter);

// app server uo
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
