// Guardo en variables las modulos que voy a usar
const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");

// inicializo el server en mi variable app
const app = express();
// variables de entorno
const process = dotenv.config().parsed;
// desestructuro mi puerto con la ruta y puerto que voy a usar
const { PORT, DBURL } = process;
// voy a utilizar el puerto 8080 y sino el 5000
const port = PORT || 5000;

// habilito los objetos json como respuesta
app.use(express.json());

// funcion que va a traer todos los productos o la cantidad especificada por queries
app.get("/products", async (req, res) => {
  // verifico que la ruta exista y si existe leo el archivo
  if (fs.existsSync(DBURL)) {
    const data = await fs.promises.readFile(DBURL, "utf-8");
    const products = JSON.parse(data);
    // si dentro de la llamada encuentra un query 'limit'
    // uso el metodo slice para que solo muestre los productos
    // hasta el limite ingresado sino todos los productos
    if (req.query.limit) {
      const limit = Number(req.query.limit);
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  }
});

// funcion que va a mostrs el prodcuto por el id ingresado en la URL
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (fs.existsSync(DBURL)) {
    const data = await fs.promises.readFile(DBURL, "utf-8");
    const products = JSON.parse(data);
    const validateId = products.some((product) => product.id === Number(id));
    console.log(validateId);
    // si el id se encuntra entre los id de mi array de productos lo muestra
    // sino imprime que le producto no se encontro
    if (validateId) {
      res.json(products.find((product) => product.id === Number(id)));
    } else {
      res.send("PRODUCT NOT FOUND");
    }
  }
});

// le digo a mi app que escuche el puerto
// imprimo en consola el numero de puerto
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});

// TEST - npm run start-server - el servidor es iniciado con nodemon.
