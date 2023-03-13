import { ERRORS_ENUM } from "../../consts/ERRORS.js";
import CustomError from "../../errors/customError.js";
import { ProductsService } from "../services/products.services.js";

//buscar todos los producto
export const getAllProductsCtr = async (req, res) => {
  try {
    const { query, limit, sort, page } = req.query;

    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: { price: sort } || { price: 1 },
      lean: true,
    };

    const result = await ProductsService.getAllProducts(query, options);

    if (!result) {
      throw new CustomError(ERRORS_ENUM["PRODUCT NOT FOUND"]);
    }

    return res.status(200).send({
      status: "succes",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.nextLink
        ? `/api/products?page=${result.nextPage}`
        : null,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send("Something went wrong");
  }
};

//buscar un prodcuto por id
export const getProductByIdCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const result = await ProductsService.getProductById(pid);

    if (!result) {
      CustomError.createError({
        name: ERRORS_ENUM["PRODUCT NOT FOUND"],
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(200).send({
      payload: result,
    });
  } catch (error) {
    console.log(error);

    if (error.name === ERRORS_ENUM["PRODUCT NOT FOUND"]) {
      CustomError.createError({
        name: ERRORS_ENUM["PRODUCT NOT FOUND"],
        message: ERRORS_ENUM["PRODUCT NOT FOUND"],
      });
    }

    return res.status(400).send(`${error}`);
  }
};

//agregar un prodcuto a la base de datos
export const addNewProductCtr = async (req, res) => {
  try {
    const newProduct = req.body;

    const result = await ProductsService.addNewProduct(newProduct);

    if (!result) {
      throw new CustomError(ERRORS_ENUM["INVALID PRODUCT PROPERTY"]);
    }

    return res.status(201).send({
      payload: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send("Something went wrong");
  }
};

//modificar un producto
export const updateProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;

    const result = await ProductsService.updateProduct(pid, newProduct);

    if (!result) {
      CustomError.createError(
        ERRORS_ENUM["PRODUCT NOT FOUND"],
        ERRORS_ENUM["PRODUCT NOT FOUND"]
      );
    }

    return res.status(202).send({
      payload: result,
    });
  } catch (error) {
    console.log(error);

    if (error.name === ERRORS_ENUM["PRODUCT NOT FOUND"]) {
      CustomError.createError(
        ERRORS_ENUM["PRODUCT NOT FOUND"],
        ERRORS_ENUM["PRODUCT NOT FOUND"]
      );
    }

    return res.status(400).send("Something went wrong");
  }
};

//eliminar un producto
export const deleteProductCtr = async (req, res) => {
  try {
    const { pid } = req.params;

    const result = await ProductsService.deleteProduct(pid);

    if (!result) {
      CustomError.createError(
        ERRORS_ENUM["PRODUCT NOT FOUND"],
        ERRORS_ENUM["PRODUCT NOT FOUND"]
      );
    }

    return res.status(202).send({
      payload: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send("Something went wrong");
  }
};
