import express from "express";
import passport from "passport";
import session from "express-session";
import { Server } from "socket.io";
import dotenv from "dotenv";
//routers
import productsRouter from "./products/products.routes.ts";
import cartRouter from "./carts/carts.routes.ts";
import chatRouter from "./messages/messages.routes.ts";
import sessionRouter from "./users/users.routes.ts";
import productsMockRouter from "./mocks/productsMock.routes.ts";
import loggerRouter from "./logger/logger.routes.ts";
import authRouter from "./auth/auth.routes.ts";
//utils
import socket from "./utils/socket.ts";
import { errorHandler } from "./middlewares/errors/index.ts";
import { addLogger } from "./utils/logger.ts";
import initSwagger from "./utils/swagger.ts";
//conections
import MongoConnection, { MongoStoreInstance } from "./utils/mongo.ts";
import { jwtStrategy, localStrategy } from "./auth/strategies/index.ts";
import swaggerUiExpress from "swagger-ui-express";
import path from "path";
//const and env variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//init mongoDb
MongoConnection.getInstance();

//passport
jwtStrategy();
localStrategy();

//middlewares
app.use(session(MongoStoreInstance));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
app.use(addLogger);

//routers
app.use("/auth", authRouter);
app.use("/api/users", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);
app.use("/mocks", productsMockRouter);
app.use("/loggerTest", loggerRouter);
app.use(
  "/api/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(initSwagger())
);

//app.listen
const httpServer = app.listen(PORT, () => {
  console.log("Server up!");
});

//socket
const io = new Server(httpServer);
socket(io);
