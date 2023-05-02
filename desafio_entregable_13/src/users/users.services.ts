import { ERRORS_ENUM } from "../consts/ERRORS.ts";
import CustomError from "../errors/customError.ts";
import tokenModel from "../models/token.model.ts";
import userModel from "../models/users.model.ts";
import sendMail from "../utils/nodemailer.ts";
import { generateCode } from "../utils.ts";
import UserDto from "./dto/user.dto.ts";
import { Document, User } from "../interface/interfaces.ts";
import path from "path";

class UserServices {
  finAll = async () => {
    try {
      const users = await userModel.find().lean().exec();

      const mapedUsers = users.map((user) => new UserDto(user));

      return mapedUsers;
    } catch (error) {
      console.log(error);
    }
  };

  findUser = async (email: User["email"]) => {
    try {
      const user = await userModel.findOne({ email }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      const userDto = new UserDto(user);

      return userDto;
    } catch (error) {
      console.log(error);
    }
  };

  changeRole = async (uid: User["_id"]) => {
    try {
      const user = await this.findUserById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      if (user?.role === "USER") {
        const userDocuments = user?.documents.map((document: Document) => {
          console.log(document);

          if (!document) {
            CustomError.createError({
              name: "DOCUMENT NOT FOUND",
              message: "YOU DONT HAVE ANY DOCUMENT UPLOADED",
            });
          }

          const result = path.parse(document.name).name;

          console.log(result);

          return result;
        });

        console.log(userDocuments);

        if (
          !userDocuments?.includes("identificación") &&
          !userDocuments?.includes("comprobante de domicilio") &&
          !userDocuments?.includes("comprobante de estado de cuenta")
        ) {
          CustomError.createError({
            name: "Invalid Credentials",
            message: "Must upload ",
          });

          return false;
        }
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { role: user?.role === "USER" ? "PREMIUM" : "USER" }
      );

      if (!result) return false;

      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  sendRestoreMail = async (email: string) => {
    try {
      const user = await this.findUser(email);

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      let token = await tokenModel.findOne({ userId: user?._id });

      if (!token) {
        token = await new tokenModel({
          userId: user._id,
          token: generateCode(),
        }).save();
      }

      const link = `${process.env.BASE_URL}/restoreForm/${user?._id}/${token.token}`;

      await sendMail.send(user.email, "Password reset", link);

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  restorePassword = async (
    uid: User["_id"],
    password: string,
    token: string
  ) => {
    try {
      const user = await this.findUserById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      const userToken = await this.findUserToken(uid, token);

      if (!userToken) {
        CustomError.createError({
          name: "ERROR",
          message: "INVALID OR EXPIRED TOKEN",
        });

        return;
      }

      const verifyPassword = await userModel.comparePassword(
        password,
        user.password
      );

      if (verifyPassword) {
        CustomError.createError({
          name: "ERROR",
          message: "CAN NOT USE THE LAST PASSWORD",
        });

        return;
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { password: await userModel.encryptPassword(password) }
      );

      if (!result) {
        return false;
      }

      await this.deleteToken(uid);

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  findUserById = async (uid: User["_id"]) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  findUserToken = async (uid: User["_id"], token: string) => {
    try {
      const userToken = await tokenModel.findOne({ userId: uid });

      return userToken;
    } catch (error) {
      console.log(error);
    }
  };

  deleteToken = async (uid: User["_id"]) => {
    try {
      const userToken = await tokenModel.deleteOne({ userId: uid });

      return userToken;
    } catch (error) {
      console.log(error);
    }
  };

  updateUpload = async (uid: User["_id"], newDocument: Document) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS_ENUM["USER NOT FOUND"],
          message: ERRORS_ENUM["USER NOT FOUND"],
        });

        return;
      }

      return await userModel.updateOne(
        { _id: uid },
        { $push: { documents: newDocument } }
      );
    } catch (error) {
      console.log(error);
    }
  };
}

const UserService = new UserServices();

export default UserService;
