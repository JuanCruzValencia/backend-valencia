import expres from "express";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import connectMongo from "./mongo.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import __dirname from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import userRouter from "./routes/users.routes.js";
import viewsRouter from "./routes/views.routes.js";
import initializePassport from "./config/passport.config.js";
import sessionRouter from "./routes/sessions.routes.js";

//const and env variables
dotenv.config();
const app = expres();
const PORT = process.env.PORT || 5000;

//init mongoDB
connectMongo();

//passport
initializePassport();

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middlewares
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.MONGO_DB,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expres.static(__dirname + "/public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

//routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", userRouter);
app.use("/", viewsRouter);

//app.listen
app.listen(PORT, () => {
  console.log("Server up!");
});
