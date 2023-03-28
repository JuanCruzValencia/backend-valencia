import dotenv from "dotenv";
import { ERRORS_ENUM } from "../../consts/ERRORS";
import CustomError from "../../errors/customError";
import UserService from "../services/users.services";
dotenv.config();

export const getRegister = (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    req.logger.error(error);

    res.render("error");
  }
};

export const getLogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    req.logger.error(error);

    res.render("error");
  }
};

export const getLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.logger.error(err);

      return res.status(500).render("errors", { error: err });
    }

    res.clearCookie(process.env.COOKIE_NAME).redirect("/login");
  });
};

export const postRegister = (req, res) => {
  res.status(200).redirect("/login");
};

export const postLogin = (req, res) => {
  if (!req.user) {
    req.logger.error("Invalid credentials");

    return res.status(400).render("error", { error: "Invalid credentials" });
  }

  req.session.user = req.user;

  res.cookie(process.env.COOKIE_NAME, req.user.token).redirect("/products");
};

export const getCurrentUser = (req, res) => {
  try {
    const user = req.session.user;

    res.status(200).render("session", { styles: "style.css", user });
  } catch (error) {
    req.logger.error(error);

    res.render("error");
  }
};

export const getRestore = (req, res) => {
  try {
    res.render("restore");
  } catch (error) {
    req.logger.error(error);

    res.render("error");
  }
};

export const postRestore = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await UserService.restorePassword(email, password);

    if (!result) {
      CustomError.createError({
        message: ERRORS_ENUM["USER NOT FOUND"],
      });
    }

    res.status(200).redirect("login");
  } catch (error) {
    req.logger.error(error);

    res.render("error");
  }
};
