import cartModel from "../models/carts.model.js";
import { InputsValidationError, NotFoundError } from "../../errors/errors.js";

export class CartManager {
  constructor() {
    this.#init();
  }

  //Cuando inicio la instancia se crea un carrito
  #init = () => {};

  //Mouestra el carrito
  getCart = () => {};

  //Agregar un prodcuto al carrito
  addProductToCart = (newProduct) => {};

  //Actualizar cantidad de un producto
  addQuantityToProduct = (pid) => {};

  //Eliminar un producto
  deleteProductFromCart = (pid) => {};

  //Vaciar carrito
  emptyCart = () => {};
}
