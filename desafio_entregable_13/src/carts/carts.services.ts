import { ERRORS_ENUM } from "../consts/ERRORS.ts";
import CustomError from "../errors/customError.ts";
import { Cart, Product, User } from "../interface/interfaces.ts";
import cartsModel from "../models/carts.model.ts";
import productsModel from "../models/products.model.ts";
import ticketModel from "../models/ticket.model.ts";
import userModel from "../models/users.model.ts";
import ProductsService from "../products/products.serivces.ts";

class CartsServices {
  createCart = async () => {
    try {
      const newCart = {
        cart: [],
      };
      const cart = await cartsModel.create(newCart);

      return cart;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  getAllCarts = async () => {
    try {
      const carts = await cartsModel.find();

      return carts;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  getCartById = async (cid: Cart["id"]) => {
    try {
      const cart = await cartsModel
        .findById({ _id: cid })
        .populate("products.product")
        .lean()
        .exec();

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      return cart;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  addProductToCart = async (
    cid: Cart["id"],
    pid: Product["_id"],
    user: User
  ) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const product = await productsModel.findById({ _id: pid }).lean().exec();

      if (!product) {
        CustomError.createError({
          name: ERRORS_ENUM["PRODUCT NOT FOUND"],
          message: ERRORS_ENUM["PRODUCT NOT FOUND"],
        });

        return;
      }

      if (product.owner == user._id) {
        CustomError.createError({
          name: "Failed to add product to cart",
          message: "Cant add to cart a product that you already own",
        });
      }

      const findProduct = await cartsModel.findOne({ "carts.product": pid });

      if (findProduct) {
        const result = await cartsModel.updateOne(
          { "carts.product": pid },
          {
            $inc: {
              "carts.$.quantity": 1,
            },
          }
        );

        return result;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { products: { product: pid } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  updateQuantity = async (
    cid: Cart["id"],
    pid: Product["_id"],
    quantity: number
  ) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const product = await cartsModel.findOne({ "carts.product": pid });

      if (!product) {
        CustomError.createError({
          name: ERRORS_ENUM["PRODUCT NOT FOUND"],
          message: ERRORS_ENUM["PRODUCT NOT FOUND"],
        });

        return;
      }

      const result = await cartsModel.updateOne(
        { "carts.product": pid },
        {
          $inc: {
            "carts.$.quantity": quantity,
          },
        }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  addArrayOfProducts = async (cid: Cart["id"], arrayOfProducts: Product[]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const mapProducts = arrayOfProducts.map((product) => {
        product: product._id;
      });

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { products: { $each: mapProducts } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  deleteProductFromCart = async (cid: Cart["id"], pid: Product["_id"]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  deleteAllProducts = async (cid: Cart["id"]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  purchaseProducts = async (cid: Cart["id"]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS_ENUM["CART NOT FOUND"],
          message: ERRORS_ENUM["CART NOT FOUND"],
        });

        return;
      }

      const products = Array.from(cart.products);

      const purchaser = await userModel.findOne({ cart: cid }).lean().exec();

      if (!purchaser) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      const total = await this.removeProductFromStock(cid, products);

      if (!total) {
        CustomError.createError({
          name: "Something went wrong",
          message: "Total Purchase",
        });

        return;
      }

      const ticket = await this.generateTicket(purchaser?.email, total);

      console.log(ticket);

      return ticket;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  generateTicket = async (purchaser: string, total: number) => {
    try {
      const result = await ticketModel.create({
        amount: total,
        purchaser: purchaser,
      });

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };

  removeProductFromStock = async (
    cid: Cart["id"],
    products: Cart["products"]
  ) => {
    try {
      let total = 0;

      products.forEach(async (product) => {
        const pid = product.product;

        const productInDb = await ProductsService.getProductById(pid);

        if (!productInDb) {
          CustomError.createError({
            name: ERRORS_ENUM["PRODUCT NOT FOUND"],
            message: ERRORS_ENUM["PRODUCT NOT FOUND"],
          });

          return;
        }

        if (await ProductsService.updateStock(pid, product.quantity)) {
          await this.deleteProductFromCart(cid, pid);

          total = total + productInDb?.price;
        }
      });

      return total;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });
    }
  };
}

const CartsService = new CartsServices();

export default CartsService;
