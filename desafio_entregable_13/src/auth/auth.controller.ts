import AuthService from "./auth.service.ts";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { SessionUser } from "../interface/interfaces.ts";
dotenv.config();

class AuthControllers {
  constructor() {}

  async loginCtrl(req: Request, res: Response) {
    if (!req.user) return res.status(400);

    const user = req.user as SessionUser;

    const loggedUser = await AuthService.login(user);

    if (!loggedUser) return res.status(404).send({ message: "User not found" });

    req.session.user = loggedUser;

    res.send(loggedUser);
  }
}

const AuthController = new AuthControllers();

export default AuthController;
