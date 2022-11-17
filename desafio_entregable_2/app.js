const fs = require("fs");

class ProductManager {
  #products;

  constructor() {
    this.#products = [];
    this.path = "./data/dbTest.js";
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

    // guardo en mi base de datos el array
    fs.promises.writeFile(this.path, JSON.stringify(this.#products));
  };

  getProducts = async () => {
    //leer la base de datos de prodcutos
    const resolve = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(resolve);
    return products;
  };

  getProductById = (productId) => {
    const productsCopy = [...this.getProducts()];
    const searchedProduct = productsCopy.find(
      (product) => product.id === productId
    );
    return searchedProduct !== undefined
      ? searchedProduct
      : console.log("NOT FOUND");
  };

  updateProduct = (updatedProduct) => {
    const productsCopy = [...this.getProducts()];
    const productToUpdate = this.getProductById(updatedProduct.id);

  };

  deleteProduct = (productId) => {
    const productsCopy = [...this.getProducts()];
    const filteredProducts = productsCopy.filter(
      (product) => product.id !== productId
    );
    fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
  };
}
