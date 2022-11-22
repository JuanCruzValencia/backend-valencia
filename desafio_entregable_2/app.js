// guardo en una variable el modulo file system
const fs = require("fs");

// Uso de estructura el desafio anterior
class ProductManager {
  #products;

  constructor() {
    this.#products = [];
    this.path = "./data/DB.json";
  }

  getProductId = () => {
    const index = this.#products.length;
    const id = index > 0 ? index + 1 : 1;
    return id;
  };

  validateInputs = ({ title, description, price, thumbnail, code, stock }) => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      thumbnail.trim().length > 0 &&
      code.trim().length > 0 &&
      price.toString().trim().length > 0 &&
      stock.toString().trim().length > 0 &&
      price > 0 &&
      stock > 0
    );
  };

  verifyCode = (productCode) => {
    const productsCopy = [...this.#products];
    const isInDb = productsCopy.some((product) => product.code === productCode);
    return isInDb;
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = this.getProductId();

    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!this.validateInputs({ ...newProduct }))
      console.log("Please fill all the inputs");
    if (this.verifyCode(newProduct.code))
      console.log("This product code already exist is the data base");

    this.#products.push(newProduct);
    // creo el archivo donde voy a guardar los datos de mi array de productos
    await fs.promises.writeFile(this.path, JSON.stringify(this.#products));
    console.log("TEST: PRODUCTO AGREGDO CON EXITO");
  };

  // funcion asincrona que va a leer el archivos con mis productos
  getProducts = async () => {
    //leer la base de datos de prodcutos
    try {
      const resolve = await fs.promises.readFile(this.path, "utf-8");
      if (resolve.length === 0) throw new Error();
      return JSON.parse(resolve);
    } catch (error) {
      console.log("Array vacio");
    }
  };

  // funcion para obtener los productos por el id, previamente me tengo que traer
  // los datos gurdados en mi archivo
  getProductById = async (productId) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const searchedProduct = productsCopyObj.find(
      (product) => product.id === productId
    );
    return searchedProduct !== undefined
      ? searchedProduct
      : console.log("NOT FOUND");
  };

  // funcion para actualizar productos de mi archivo
  updateProduct = async (updatedProduct) => {
    // primero elimino el producto anterior con el id de mi producto actualizado
    this.deleteProduct(updatedProduct.id);
    // despues guardo mi nuevo producto en mi array
    const updatedArray = this.#products.push(updatedProduct);
    // sobre escribo mi archivo con mi producto actualizado
    await fs.promises.writeFile(this.path, JSON.stringify(updatedArray));
  };

  // funcion para eliminar prodcutos de mi archivo
  deleteProduct = async (productId) => {
    const productsCopy = [...this.#products];
    const filteredProducts = productsCopy.filter(
      (product) => product.id !== productId
    );
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
  };
}

// TESTS

// Creando una instancia de la clase Product Manager
const valencia = new ProductManager();

// Se invoca a getProducts() devuelve productos | error y mensaje
valencia
  .getProducts()
  .then((products) =>
    console.log(`Primer test: ${products ? products : "NO HAY PRODUCTOS"}`)
  );

// Se agrega un nuevo producto

valencia
  .addProduct(
    "Producto de prueba",
    "Este es un producto de prueba",
    250,
    "No hay imagen",
    "abc123",
    50
  )
  .then(() => {
    // Se invoca a getProducts() nuevamente con el prodcuto ya ingresado en el array
    valencia
      .getProducts()
      .then((products) =>
        console.log(`Segundo test: ${products ? products : "NO HAY PRODUCTOS"}`)
      );
  });
