import express from "express";
import CartModel from "../dao/models/cart.model.js";
import ProductsModel from "../dao/models/products.model.js";
import { ERRORS } from "../consts/errors.js";

const Router = express.Router();

// crear un nuevo carrito en la primer instancia
Router.post("/", async (req, res) => {
  try {
    const newCart = {
      products: [],
    };

    const result = await CartModel.create(newCart);

    res.send({
      succes: true,
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error,
    });
  }
});

// mostrar los productos que hay en el carrito
Router.get("/:cuuid", async (req, res) => {
  try {
    const { cuuid } = req.params;

    if (!cuuid) {
      return res.send({
        succes: false,
        error: ERRORS.INPUT_VALIDATION_ERROR,
      });
    }

    const result = await CartModel.findById({
      _id: cuuid,
    });

    if (!result) {
      return res.send({
        succes: false,
        error: ERRORS.NOT_FOUND_ERROR,
      });
    }

    res.send({
      succes: true,
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error,
    });
  }
});

// agregar un producto a un carrito
Router.post("/:cuuid/:puuid", async (req, res) => {
  try {
    const { cuuid } = req.params;

    if (!cuuid) {
      return res.send({
        succes: false,
        error: ERRORS.INPUT_VALIDATION_ERROR,
      });
    }

    const { puuid } = req.params;

    if (!puuid) {
      return res.send({
        succes: false,
        error: ERRORS.INPUT_VALIDATION_ERROR,
      });
    }

    const product = await ProductsModel.findById({
      _id: puuid,
    });

    const result = await ProductsModel.updateOne(
      {
        _id: cuuid,
      },
      {
        products: product,
      }
    );

    res.send({
      succes: true,
      product,
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error,
    });
  }
});

export default Router;
