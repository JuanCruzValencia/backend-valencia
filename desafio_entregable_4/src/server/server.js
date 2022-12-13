import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "../utils_dirname.js";
import { PORT } from "../const/port.js";
import { ProductRouter, CartRouter, ViewsRouter } from "../routes/index.js";
import { Server } from "socket.io";

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
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("client connected");
});
