import { connect, set } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongo = async () => {
  try {
    set("strictQuery", false);
    await connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB });

    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
