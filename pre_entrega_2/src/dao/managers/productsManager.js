import productsModel from "../models/products.model.js";
import { InputsValidationError, NotFoundError } from "../../errors/errors.js";

export class ProductManager {
  // Mostrar todos los productos
  getProducts = async () => {
    try {
      const products = await productsModel.find();

      if (!products) {
        throw new Error("THE DB IS EMPTY");
      }

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Mostrar un producto por id
  getProductById = async (pid) => {
    try {
      const product = await productsModel.findById({ _id: pid });

      if (!product) {
        throw new NotFoundError("PRODUCT NOT FOUND");
      }

      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Agregar un producto
  addProduct = async (newProduct) => {
    try {
      if (!newProduct) {
        throw new InputsValidationError("COMPLETE ALL THE FIELDS");
      }

      const result = await productsModel.create(newProduct);

      if (!result) {
        throw new Error("FAILED TO ADD TO DATABASE");
      }

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Actualizar un producto por id
  updateProduct = async (pid, updatedProduct) => {
    try {
      if (!pid) {
        throw new InputsValidationError("INVALID PRODUCT ID");
      }

      const result = await productsModel.findByIdAndUpdate(
        { _id: pid },
        updatedProduct
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // eliminar un producto
  deleteProduct = async (pid) => {
    try {
      if (!pid) {
        throw new InputsValidationError("INVALID PRODUCT ID");
      }

      const result = await productsModel.deleteOne({ _id: pid });

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
