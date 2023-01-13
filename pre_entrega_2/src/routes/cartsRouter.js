import express from "express";
import Managers from "../dao/managers/index.js";

const Router = express.Router();

// Mostrar todos los carritos
Router.get("/", async (req, res) => {
  try {
    const carts = await Managers.CartsManager.getCarts();

    res.send({
      status: "succes",
      payload: carts,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMTHING WENT WRONG",
    });
  }
});

//Crea un nuevo carrito
Router.post("/", async (req, res) => {
  try {
    const result = await Managers.CartsManager.createCart();

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

//Muestra un carrito en particular y sus productos
Router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await Managers.CartsManager.getCartById(cid);

    if(!result){
        return res.send({
            status: "error",
            error: "CART NOT FOUND"
        })
    }

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMETHING WENT WRONG",
    });
  }
});

// Agrego un prodcuto al carrito
Router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = Managers.CartsManager.addProductToCart(cid, pid);

    res.send({
      status: "succes",
      payload: result,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "error",
      error: error.message || "SOMTHING WENT WRONG",
    });
  }
});

export default Router;
