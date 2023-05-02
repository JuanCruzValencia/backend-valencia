import { Router } from "express";
import { authToken } from "../utils/jwt.ts";
import ProductsController from "./products.controller.ts";
import { authPolicies } from "../utils.ts";

const router = Router();

router.get("/", authToken, ProductsController.getAllProducts);

router.get("/:pid", ProductsController.getProductById);

router.post(
  "/",
  authToken,
  authPolicies("ADMIN", "PREMIUM"),
  ProductsController.addNewProduct
);

router.put(
  "/:pid",
  authToken,
  authPolicies("ADMIN", null),
  ProductsController.updateProduct
);

router.delete(
  "/:pid",
  authToken,
  authPolicies("ADMIN", "PREMIUM"),
  ProductsController.deleteProduct
);

export default router;
