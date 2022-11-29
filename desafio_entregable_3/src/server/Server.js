// Guardo en variables las modulos que voy a usar
const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");
const { ProductManager } = require("../app/app");

// inicializo el server en mi variable app
const app = express();
// variables de entorno
const process = dotenv.config().parsed;
// desestructuro mi puerto con la ruta y puerto que voy a usar
const { PORT, DBURL } = process;
// voy a utilizar el puerto 8080 y sino el 5000
const port = PORT || 5000;
// creo un instancia de mi clase ProductManager con el URL de mi base de datos
const PM = new ProductManager(DBURL);

// habilito los objetos json como respuesta
app.use(express.urlencoded({ extended: true }));

// funcion que va a traer todos los productos o la cantidad especificada por queries
app.get("/products", async (req, res) => {
  const products = await PM.getProducts();
  // verifico que la query exista y si existe leo el archivo
  if (req.query.limit) {
    const limit = Number(req.query.limit);
    const filteredProducts = products.slice(0, limit);
    res.send({ filteredProducts });
  } else {
    res.send({ products });
  }
});

// funcion que va a mostrs el prodcuto por el id ingresado en la URL
app.get("/products/:id", async (req, res) => {
  const products = await PM.getProducts();
  const { id } = req.params;
  const validateId = products.some((product) => product.id === Number(id));
  // si el id se encuntra entre los id de mi array de productos lo muestra
  // sino imprime que le producto no se encontro
  if (validateId) {
    const productFiltered = await PM.getProductById(Number(id));
    res.send({ productFiltered });
  } else {
    res.send("PRODUCT NOT FOUND");
  }
});

// le digo a mi app que escuche el puerto
// imprimo en consola el numero de puerto
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});

// TEST - npm run start-server - el servidor es iniciado con nodemon.
