import expres from "express";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import passport from "passport";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import MongoConnection from "./mongo.js";

//const and env variables
dotenv.config();
const app = expres();
const PORT = process.env.PORT || 5000;

//init mongoDB
MongoConnection.getInstance()

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middlewares
app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(expres.static(__dirname + "/public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

//routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

//app.listen
app.listen(PORT, () => {
  console.log("Server up!");
});
