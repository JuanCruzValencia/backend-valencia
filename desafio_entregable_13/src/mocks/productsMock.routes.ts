import express from "express";
import { generateMockProducts } from "./productsMock.controller.ts";

const Router = express.Router();

Router.get("/mockingproducts", generateMockProducts);

export default Router;
