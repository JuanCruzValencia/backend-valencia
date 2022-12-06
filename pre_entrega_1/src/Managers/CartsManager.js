import { Router } from "express";
import { CartManager } from "../app/index.js";
import { ERRORS } from "../consts/errors.js";

const router = Router();

router.post("/api/carts/", async (req, res) => {
  try {
    const newCart = await CartManager.createCart();

    res.send({
      succes: true,
      card: newCart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error: "Ocurrio un error",
    });
  }
});

router.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid: cartId } = req.params;

    const id = Number(cartId);

    if (Number.isNaN(id) || id < 0) {
      return res.send({
        succes: false,
        error: "El id ingresado es invalido",
      });
    }

    const cart = await CartManager.getCart(id);

    if (!cart) {
      res.send({
        succes: false,
        error: "Carrito no encontrado",
      });
    }

    res.send({
      succes: true,
      cart: cart,
    });
  } catch (error) {
    console.log(error);

    res.send({
      succes: false,
      error: "Ocurrio un error",
    });
  }
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid: cartId } = req.params;

    const cid = Number(cartId);

    if (Number.isNaN(cid) || cid < 0) {
      return res.send({
        succes: false,
        error: "El id del carrito ingresado es invalido",
      });
    }

    const { pid: productId } = req.params;

    const pid = Number(productId);

    if (Number.isNaN(pid) || pid < 0) {
      return res.send({
        succes: false,
        error: "El id del producto ingresado ex invalido",
      });
    }

    const productAdded = await CartManager.addProductToCart(cid, pid);

    res.send({
      succes: true,
      product: productAdded,
    });
  } catch (error) {
    console.log(error);

    if (error.name === ERRORS.NOT_FOUND_ERROR) {
      return res.send({
        succes: false,
        error: `${error.name}: ${error.message}`,
      });
    }

    res.send({
      succes: false,
      error: "Ocurrio un error",
    });
  }
});

export default router;
