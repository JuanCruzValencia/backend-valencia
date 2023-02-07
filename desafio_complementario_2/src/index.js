import expres from "express";
import dotenv from "dotenv";
import connectMongo from "./mongo.js";
import passport from "passport";
import productsRouter from "./routes/products.routes.js"

//const and env variables
dotenv.config();
const app = expres();
const PORT = process.env.PORT || 5000;

//init mongoDB
connectMongo();

//middlewares
app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(passport.initialize());

//routers
app.use("/api/products", productsRouter);

//app.listen
app.listen(PORT, () => {
  console.log("Server up!");
});
