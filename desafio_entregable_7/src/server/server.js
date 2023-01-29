import express from "express";
import handlebars from "express-handlebars";
import { connectDB } from "./mongo/mongo.js";
import dotenv from "dotenv";
import __dirname from "../dirname.js";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import auth from "../utils/auth.js";
import {
  authRouter,
  cartsRouter,
  productsRouter,
  viewsRouter,
} from "../routes/index.js";
import initializePassporr from "../utils/passport.config.js";
import passport from "passport";

//const
const app = express();
dotenv.config();

// initialize passport
initializePassporr();

//mongo connect
connectDB();

//public folder config and middlewares
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGOOSE_URI,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200,
    }),
    secret: "india",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//routes
app.use("/", authRouter);
app.use("/home", auth, viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port" ${process.env.PORT}`);
});
