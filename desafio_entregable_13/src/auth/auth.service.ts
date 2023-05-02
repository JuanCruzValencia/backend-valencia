import jwt from "jsonwebtoken";
import userModel from "../models/users.model.ts";
import dotenv from "dotenv";
import CustomError from "../errors/customError.ts";
import { ERRORS_ENUM } from "../consts/ERRORS.ts";
import { SessionUser, User } from "../interface/interfaces.ts";
dotenv.config();

class AuthServices {
  constructor() {}

  async validateUser(username: User["email"], password: User["password"]) {
    const user = await userModel.findOne({ email: username });

    if (!user) {
      CustomError.createError({
        name: ERRORS_ENUM["USER NOT FOUND"],
        message: "User not found in DB",
      });
    }

    if (user && (await userModel.comparePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(payload: SessionUser) {
    const user = { ...payload };

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: 1200,
    });

    user.accessToken = token;

    return user;
  }

  updateLoginDate = async (id: User["_id"]) => {
    return await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: { last_connection: Date.now() },
      },
      { new: true }
    );
  };
}

const AuthService = new AuthServices();

export default AuthService;
