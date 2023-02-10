import express from "express";
import {
  getLogin,
  getLogout,
  getRegister,
} from "../controllers/users.controllers.js";

const Router = express.Router();

Router.get("/register", getRegister);

Router.get("/login", getLogin);

Router.post("/register");

Router.post("/login");

Router.get("/logout", getLogout);

export default Router;
