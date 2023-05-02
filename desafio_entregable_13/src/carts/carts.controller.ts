import { ERRORS_ENUM } from "../consts/ERRORS.ts";
import CustomError from "../errors/customError.ts";
import { SessionUser, UserSession } from "../interface/interfaces.ts";
import CartsService from "./carts.services.ts";
import { Request, Response } from "express";

class CartsControllers {
  constructor() {}

  createCart = async (req: Request, res: Response) => {
    try {
      await CartsService.createCart();

      res.status(200);
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  getCarts = async (req: Request, res: Response) => {
    try {
      const result = await CartsService.getAllCarts();

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  getCartById = async (req: Request, res: Response) => {
    try {
      const { cid } = req.params;

      const result = await CartsService.getCartById(cid);

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  addProductToCart = async (req: Request, res: Response) => {
    try {
      const { cid, pid } = req.params;

      const data = req.user as UserSession;

      const user = data.user._doc; //TODO should be a better way of deconstruc the request.user

      const result = await CartsService.addProductToCart(cid, pid, user);

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  updateProductQuantity = async (req: Request, res: Response) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const result = await CartsService.updateQuantity(cid, pid, quantity);

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  addArrayOfProducts = async (req: Request, res: Response) => {
    try {
      const { cid } = req.params;
      const arrayOfProducts = req.body;

      const result = await CartsService.addArrayOfProducts(
        cid,
        arrayOfProducts
      );

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  deleteOneProduct = async (req: Request, res: Response) => {
    try {
      const { cid, pid } = req.params;

      await CartsService.deleteProductFromCart(cid, pid);

      res.status(200);
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  emptyCart = async (req: Request, res: Response) => {
    try {
      const { cid } = req.params;

      await CartsService.deleteAllProducts(cid);

      res.status(200);
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };

  purchaseCart = async (req: Request, res: Response) => {
    try {
      const { cid } = req.params;

      const result = await CartsService.purchaseProducts(cid);

      res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      req.logger.error(error);

      res.status(400).send({ status: error.name, message: error.message });
    }
  };
}

const CartsController = new CartsControllers();

export default CartsController;
