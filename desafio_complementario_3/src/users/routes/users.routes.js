import express from "express";
import passport from "passport";
import {
  getLogin,
  getLogout,
  getRegister,
  getRestore,
  postLogin,
  postRegister,
  postRestore,
} from "../controller/users.controllers.js";

const Router = express.Router();

Router.get("/register", getRegister);

Router.get("/login", getLogin);

Router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/error" }),
  postRegister
);

Router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/error" }),
  postLogin
);

Router.get("/logout", getLogout);

Router.get("/restore", getRestore);

Router.post("/restore", postRestore);

export default Router;
