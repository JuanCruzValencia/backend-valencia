import cartModel from "../models/carts.model.js";
import { NotFoundError } from "../../errors/errors.js";

export class CartManager {
  //Cuando inicio la instancia se crea un carrito
  createCart = async () => {
    try {
      const newCart = {
        products: [],
      };

      const result = await cartModel.create(newCart);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  //Mostrar todos los carritos
  getCarts = async () => {
    try {
      const carts = await cartModel.find();

      if (!carts) {
        throw new NotFoundError("NO CARTS IN DATABASE");
      }

      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  //Muestra el carrito
  getCartById = async (cid) => {
    try {
      const cart = await cartModel.findById({ _id: cid });

      if (!cart) {
        throw new NotFoundError("CART NOT FOUND");
      }

      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  //Agregar un prodcuto al carrito
  addProductToCart = async (cid, pid) => {
    try {
      const findProductInCart = await cartModel.findOne({
        "cart.id": pid,
      });

      if (findProductInCart) {
        const upgradeQuantity = await cartModel.updateOne(
          {
            "cart._id": pid,
          },
          {
            $inc: {
              "cart.$.quantity": 1,
            },
          }
        );

        return upgradeQuantity;
      }

      const result = await cartModel.updateOne(
        {
          _id: cid,
        },
        {
          $push: {
            cart: { _id: pid, quantity: 1 },
          },
        }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  //Actualizar cantidad de un producto
  addQuantityToProduct = async (pid) => {
    try {
      const findProductInCart = await cartModel.findOne({
        "products.id": pid,
      });

      if (!findProductInCart) {
        throw new NotFoundError("PRODUCT NOT FOUND IN CART");
      }

      const upgradeQuantity = await cartModel.updateOne(
        {
          "products.id": pid,
        },
        {
          $inc: {
            "products.$.quantity": 1,
          },
        }
      );

      return upgradeQuantity;
    } catch (error) {
      console.log(error);
    }
  };

  //Eliminar un producto
  deleteProductFromCart = async (pid) => {
    try {
      const findProductInCart = await cartModel.findOne({
        "products.id": pid,
      });

      if (!findProductInCart) {
        throw new NotFoundError("PRODUCT NOT FOUND IN CART");
      }

      const deleteOne = await cartModel.deleteOne({
        "products.id": pid,
      });

      return deleteOne;
    } catch (error) {
      console.log(error);
    }
  };

  //Vaciar carrito
  emptyCart = async () => {
    try {
      const emptyCart = await cartModel.remove({});

      return emptyCart;
    } catch (error) {
      console.log(error);
    }
  };
}
