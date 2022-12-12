import fs from "fs";
import { NotFoundError, ValidationError } from "../utils/index.js";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.#init();
  }

  // Cuando se inicia la clase verifica que exista un archivo y sino crea uno
  #init = () => {
    try {
      const existFile = fs.existsSync(this.path);

      if (existFile) return;

      fs.writeFileSync(this.path, JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  };

  getIndex = async () => {
    const products = await this.getProducts();

    const index = products.length;

    const id = index > 0 ? index + 1 : 1;

    return id;
  };

  verifyCode = async (code) => {
    const products = await this.getProducts();

    const isValid = products.some((product) => product.code === code);

    return isValid;
  };

  getProducts = async () => {
    const products = await fs.promises.readFile(this.path, "utf-8");

    return JSON.parse(products);
  };

  getProductById = async (id) => {
    const products = await this.getProducts();

    if (!id) {
      throw new NotFoundError("ID NOT FOUND");
    }

    return products.find((product) => product.id === id);
  };

  addProduct = async ({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) => {
    if (!title && !description && !code && !price && !stock && !category) {
      throw new ValidationError("FILL ALL THE INPUTS");
    }

    if (this.verifyCode) {
      throw new ValidationError("THE CODE IS REPEATED");
    }

    const id = await this.getIndex();

    if (!id) {
      throw new Error("AN ERRORS HAS OCURRED");
    }

    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      status: true,
      thumbnails: thumbnails || [],
    };

    const products = await this.getProducts();

    products.push(newProduct);

    await fs.promises.writeFile(this.path, JSON.stringify(products));

    return {
      message: "Products added succesfully",
    };
  };

  updateProduct = async (productId, updatedProduct) => {
    const products = await this.getProducts();

    const findProductIndex = products.findIndex(
      (product) => product.id === productId
    );

    if (findProductIndex === -1) {
      throw new NotFoundError("PRODUCT NOT FOUND");
    }

    originalProduct = products[findProductIndex];

    products[findProductIndex] = {
      ...originalProduct,
      ...updatedProduct,
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products));

    return products[findProductIndex];
  };

  deleteProduct = async (id) => {
    const products = await this.getProducts();

    const findProductIndex = products.findIndex((product) => product.id === id);

    if (findProductIndex === -1) {
      throw new NotFoundError("PRODUCT NOT FOUND");
    }

    const listUpdated = products.splice(findProductIndex, 1);

    await fs.promises.writeFile(this.path, JSON.stringify(products));

    return listUpdated[0];
  };
}

export default ProductManager;
