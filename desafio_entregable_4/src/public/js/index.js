const socket = io();

const container = document.getElementById("socket__container");

socket.on("products", (data) => {
  container.innerHTML = "";

  data.map((product) => {
    const card = document.createElement("div");
    card.innerHTML += `<P>${product.title}</p>`;
    container.appendChild(card);
  });
});

socket.on("addProduct", (data) => {
  container.innerHTML = "";

  data.map((product) => {
    const card = document.createElement("div");
    card.innerHTML += `<P>${product.title}</p>`;
    container.appendChild(card);
  });
});

socket.emit("message", "Hasta aca vamos bien");
