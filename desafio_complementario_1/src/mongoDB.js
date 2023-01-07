import { connect } from "mongoose";
import dotenv from "dotenv";

const process = dotenv.config().parsed;
const { MONGOOSE_URI } = process;


export const connectDB = async () => {
  try {
    await connect(MONGOOSE_URI);
    console.log("Connected to db");
  } catch (error) {
    console.error(error);
  }
};