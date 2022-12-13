import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import ViewsRouter from "./routes/views.router.js";

import { Server } from "socket.io";

const PORT = 8080 || 3000;

// server http express
const app = express();

// server websocket
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
const socketServer = new Server(httpServer);

// setup de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// setup de los archivos estaticos
app.use(express.static(__dirname + "/public"));

app.use("/", ViewsRouter);

socketServer.on("connection", (socket) => {
  console.log("New client connected");

  // recibiendo un mensaje del del cliente
  socket.on("message", (data) => {
    console.log(`FROM CLEINT: `, data);
  });

  // emitiendo un mensaje desde el sevidor
  socket.emit("para uno", "que miras bobo");

  socket.broadcast.emit(
    "para todos menos el que envio el mensaje",
    "anda palla bobo"
  );

  socketServer.emit("para todos", "si bobo anda paalla");
});
