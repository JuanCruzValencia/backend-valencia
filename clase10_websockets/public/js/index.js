const socket = io();

// emitiendo un mensaje desde el cliente
socket.emit("message", "Enviando el primer mensaje con socket");

// recibiendo el mensaje del servidor
socket.on("para uno", (data) => {
  console.log(data);
});
