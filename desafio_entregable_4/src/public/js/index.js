const socket = io();

const container = document.getElementById("socket__container");

const printProducts = (products) => {
  container.innerHTML = "";

  products.map((product) => {
    const card = document.createElement("div");
    card.innerHTML += `
    <div class="product__container">
      <div class="product__category">
        <span>${product.category}</span>
      </div>
      <div class="product__img--container">
        <img src=${product.thumbnail} alt=${product.title} />
      </div>
      <h4 class="product__price">PRICE: $${product.price}</h4>
      <h3 class="product__title">${product.title}</h3>
      <button>add to cart</button>
    </div>`;
    container.appendChild(card);
  });
};

socket.on("products", (data) => {
  console.log("All products printed on DOM");

  printProducts(data);
});

socket.on("addProduct", (data) => {
  console.log("Product added");

  printProducts(data);
});

socket.on("deletedProduct", (data) => {
  console.log("Product deleted");

  printProducts(data);
});
