// guardo en una variable el modulo file system
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProductId = async () => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const index = productsCopyObj.length;
    const id = index === undefined ? index + 1 : 1;
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

  verifyCode = async (productCode) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const isInDb = productsCopyObj.some(
      (product) => product.code === productCode
    );
    return isInDb;
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = await this.getProductId().then((id) => id);
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    if (!this.validateInputs({ ...newProduct })) {
      console.log("Please fill all the inputs");
    }
    const codeIsVerify = await this.verifyCode(newProduct.code);
    if (codeIsVerify) {
      console.log("This product code already exist is the data base");
    }
    await fs.promises.writeFile(this.path, JSON.stringify([newProduct]));
    console.log("TEST: PRODUCTO AGREGDO CON EXITO");
  };

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const resolve = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(resolve);
      return products;
    } else {
      return [];
    }
  };

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

  updateProduct = async (productId, objUpdated) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const productToUpdate = productsCopyObj.find(
      (product) => product.id === productId
    );
    const filteredProducts = productsCopyObj.filter(
      (product) => product.id !== productId
    );
    const prodcutUpdated = { id: productToUpdate.id, ...objUpdated };
    filteredProducts.push(prodcutUpdated);
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
    console.log(filteredProducts);
  };

  deleteProduct = async (productId) => {
    const productsCopy = await fs.promises.readFile(this.path, "utf-8");
    const productsCopyObj = JSON.parse(productsCopy);
    const filteredProducts = productsCopyObj.filter(
      (product) => product.id !== productId
    );
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
  };
}

module.exports = { ProductManager };
