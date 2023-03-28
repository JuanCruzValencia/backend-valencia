import express from "express";
import { changeUserRole } from "../controller/users.controllers.js";

const Router = express.Router();

Router.get("/:uid", changeUserRole);

export default Router;
