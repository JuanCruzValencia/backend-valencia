import { productsModel } from "../models/products.model.js";

export default class ProductsServices {
  getAllProducts = async (query, options) => {
    try {
      if (query === "inStock") {
        const products = await productsModel.paginate(
          { status: true },
          options
        );
        5;

        return products;
      }

      if (
        query === "jewelery" ||
        query === "men's clothings" ||
        query === "women's clothings" ||
        query === "electronics"
      ) {
        const prodcuts = await productsModel.paginate(
          { category: query },
          options
        );

        return prodcuts;
      }
      const products = await productsModel.paginate({}, options);

      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById({ _id: pid });

      if (!product) {
        throw new Error("Product Not Found");
      }

      return product;
    } catch (error) {
      console.log(error);
    }
  };

  addNewProduct = async (newProduct) => {
    try {
      const product = await this.getProductById(newProduct.code);

      if (product) {
        throw new Error("Product Already Exist in DB");
      }

      const addProduct = await productsModel.create(newProduct);

      return addProduct;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (pid, newProduct) => {
    try {
      const product = await this.getProductById(pid);

      if (!product) {
        throw new Error("Product Not Found");
      }

      const updateProduct = await productsModel.updateOne(
        { _id: pid },
        newProduct
      );

      return updateProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (pid) => {
    try {
      const product = await this.getProductById(pid);

      if (!product) {
        throw new Error("Product Not Found");
      }

      const deleteProduct = await productsModel.deleteOne({ _id: pid });

      return deleteProduct;
    } catch (error) {
      console.log(error);
    }
  };
}

export const ProductsService = new ProductsServices()