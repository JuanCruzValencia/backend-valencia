import { connect } from "mongoose";
import { config } from "dotenv";

const process = config().parsed;
const { MONGOOSE_URI } = process;

export const connectDB = async () => {
  try {
    await connect(MONGOOSE_URI);

    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
