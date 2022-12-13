const socket = io();

socket.emit("message", () => {
  console.log("buenas");
});
