import express from "express";
import { ProdManager } from "../app/index.js";
import { ERRORS } from "../const/errors.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await ProdManager.getProducts();

    if (!products) {
      res.send({
        succes: false,
        error: "An unexpected error has ocurred",
      });
    }

    const { limit } = req.query;

    if (!limit || limit < 0) {
      res.send({
        succes: true,
        products,
      });
    }

    const filteredProducts = products.slice(0, limit);

    res.send({
      succes: true,
      products: filteredProducts,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error: "An unexpected error has ocurred",
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const id = Number(pid);

    if (Number.isNaN(id) || id < 0) {
      res.send({
        succes: false,
        error: "Invalid ID",
      });
    }

    const product = await ProdManager.getProductById(id);

    res.send({
      succes: true,
      product,
    });
  } catch (error) {
    console.log(error);

    if (error.name === ERRORS.NOT_FOUND_ERROR) {
      res.send({
        succes: false,
        error: `${error.name}: ${error.message}`,
      });
    }

    res.send({
      succes: false,
      error: "An unexpected error has ocurred",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;

    res.send({
      succes: true,
      product: newProduct,
    });
  } catch (error) {
    console.log(error);

    if (error.name === ERRORS.VALIDATION_ERROR) {
      res.send({
        succes: false,
        error: `${error.name}: ${error.message}`,
      });
    }

    res.send({
      succes: false,
      error: "An unexpected error has ocurred",
    });
  }
});

export default router;
