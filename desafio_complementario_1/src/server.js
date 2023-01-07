import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import socket from "./socket.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartRouter.js";
import messageRouter from "./routes/messagesRouter.js";
import { connectDB } from "./mongoDB.js";

// variables de entorno y servidor
const process = dotenv.config().parsed;
const { PORT } = process;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
const io = new Server(httpServer);

// mongoDB
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  req.io = io;

  return next();
});

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/", viewsRouter);
app.use("/messages", messageRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// socket
socket(io);
