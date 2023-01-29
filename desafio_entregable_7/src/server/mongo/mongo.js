import { connect, set } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    set("strictQuery", false);
    await connect(process.env.MONGOOSE_URI, { dbName: "ecommerce" });

    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
