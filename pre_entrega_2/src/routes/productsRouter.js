import express from "express";
import Managers from "../dao/managers/index.js";

const Router = express.Router();

//Mostrar todos los productos
Router.get("/", async (req, res) => {
  try {
    const products = await Managers.ProductsManager.getProducts();

    const { limit } = req.query;

    if (!limit || limit < 0) {
      return res.send({
        status: "succes",
        payload: products,
      });
    }

    const filteredProducts = products.slice(0, limit);

    res.send({
      status: "succes",
      payload: filteredProducts,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: "SOMETHING WENT WRONG",
    });
  }
});

//Traer un solo prodcuto por id
Router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Managers.ProductsManager.getProductById(pid);

    res.send({
      status: "succes",
      payload: product,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

//Agrego un nuevo producto que llega por req.body
Router.post("/", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

export default Router;
