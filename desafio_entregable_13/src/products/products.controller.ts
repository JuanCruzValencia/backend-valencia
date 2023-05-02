import ProductsService from "./products.serivces.ts";
import { Request, Response } from "express";

class ProductsControllers {
  constructor() {}

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const { query, limit, sort, page } = req.query;

      const queryParam = query?.toString() || ""; //TODO this should not be needed

      const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        sort: { price: sort } || { price: 1 },
        lean: true,
      };

      const result = await ProductsService.getAllProducts(queryParam, options);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "PRODUCTS NOT FOUND IN DB" });
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
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;

      const result = await ProductsService.getProductById(pid);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "PRODUCT NOT FOUND" });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  addNewProduct = async (req: Request, res: Response) => {
    try {
      const newProduct = req.body;

      const user = req.session.user;

      if (!user) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "USER NOT FOUND IN DB" });
      }

      const { title, price, description, code, category } = newProduct;

      if (!title || !price || !description || !code || !category) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "ONE OR MORE INVALID PROPERTIES" });
      }

      const result = await ProductsService.addNewProduct(newProduct, user);

      if (!result) {
        return res.status(400).send({
          status: "ERROR",
          message: "PRODUCT CAN NOT BE ADDED TO CART",
        });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      const newProduct = req.body;

      const result = await ProductsService.updateProduct(pid, newProduct);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "PRODUCT NOT FOUND IN DB" });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;

      const user = req.session.user;

      if (!user) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "USER NOT FOUND IN DB" });
      }

      const result = await ProductsService.deleteProduct(pid, user);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: "PRODUCT NOT FOUND IN DB" });
      }

      return res.status(202).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };
}

const ProductsController = new ProductsControllers();

export default ProductsController;
