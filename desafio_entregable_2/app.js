// guardo en una variable el modulo file system
const fs = require("fs");

// Uso de estructura el desafio anterior
class ProductManager {
  #products;

  constructor() {
    this.#products = [];
    this.path = "./data/DB.js";
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
    const productsCopy = [...this.getProducts()];
    const isInDb = productsCopy.some((product) => product.code === productCode);
    return isInDb;
  };

  addProduct = (title, description, price, thumbnail, code, stock) => {
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
    fs.promises.writeFile(this.path, JSON.stringify(this.#products));
  };

  // funcion asincrona que va a leer el archivos con mis productos
  getProducts = async () => {
    //leer la base de datos de prodcutos
    const resolve = await fs.promises.readFile(this.path, "utf-8");
    const products = await JSON.parse(resolve);
    console.log(products);
    return products;
  };

  // funcion para obtener los productos por el id, previamente me tengo que traer
  // los datos gurdados en mi archivo
  getProductById = (productId) => {
    const productsCopy = [...this.getProducts()];
    const searchedProduct = productsCopy.find(
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
    const productsCopy = [...this.getProducts()];
    const filteredProducts = productsCopy.filter(
      (product) => product.id !== productId
    );
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
  };
}

//hacer pruebas y enviar