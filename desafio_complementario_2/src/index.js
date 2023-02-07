import expres from "express";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import connectMongo from "./mongo.js";
import passport from "passport";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

//const and env variables
dotenv.config();
const app = expres();
const PORT = process.env.PORT || 5000;

//init mongoDB
connectMongo();

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middlewares
app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(expres.static(__dirname + "/public"));

//routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

//app.listen
app.listen(PORT, () => {
  console.log("Server up!");
});
