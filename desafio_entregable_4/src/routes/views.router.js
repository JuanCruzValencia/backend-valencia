import express from "express";
import { ProdManager } from "../app/index.js";
//import { ERRORS } from "../const/errors.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await ProdManager.getProducts();

    if (!products) {
      return res.send({
        succes: false,
        error: "An unexpected error has ocurred",
      });
    }

    const { limit } = req.query;

    if (!limit || limit < 0) {
      return res.render("home", {
        style: "style.css",
        products,
      });
    }

    const filteredProducts = products.slice(0, limit);

    res.render("home", {
      style: "style.css",
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

export default router;
