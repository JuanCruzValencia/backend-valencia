import { CartServices } from "../../carts/services/carts.services.js";
import { ERRORS_ENUM } from "../../consts/ERRORS.js";
import CustomError from "../../errors/customError.js";
import userModel from "../../models/users.model.js";
import { generateToken } from "../../utils/jwt.js";
import UserDto from "../dto/user.dto.js";

class UserServices {
  finAll = async () => {
    try {
      const users = await userModel.find().lean().exec();

      const mapedUser = users.map((user) => new UserDto(user));

      return mapedUser;
    } catch (error) {
      console.log(error);
    }
  };

  findUser = async (email) => {
    try {
      const result = await userModel.findOne({ email }).lean().exec();

      const user = new UserDto(result);

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  registerUser = async (req, username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec();

      if (user) {
        return done(null, false);
      }

      const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        password: await userModel.encryptPassword(password),
        cart: await CartServices.createCart(),
      };

      const createNewUser = await userModel.create(newUser);

      return done(null, createNewUser);
    } catch (error) {
      console.log(error);

      return done(error);
    }
  };

  loginUser = async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec();

      if (!user) {
        console.log("User Not Found");

        return done(null, user);
      }

      const verifyPassword = await userModel.comparePassword(
        password,
        user.password
      );

      if (!verifyPassword) {
        console.log("Incorrect Password");

        return done(null, false);
      }

      const dtoUser = new UserDto(user);

      const token = generateToken(dtoUser);

      dtoUser.token = token;

      return done(null, dtoUser);
    } catch (error) {
      console.log(error);

      return done(error);
    }
  };

  logoutUser = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  sendRestoreMail = async (email) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  restorePassword = async (email, password) => {
    try {
      const user = await this.findUser(email);

      if (!user) {
        CustomError.createError({
          message: ERRORS_ENUM["USER NOT FOUND"],
        });
      }

      const verifyPassword = await userModel.comparePassword(
        password,
        user.password
      );

      if (verifyPassword) {
        CustomError.createError({
          message: "Can not use the last password, must bne a new one",
        });
      }

      const result = await userModel.updateOne(
        { _id: user._id },
        { password: await userModel.encryptPassword(password) }
      );

      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  };
}

const UserService = new UserServices();

export default UserService;
