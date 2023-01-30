import { connect, set } from "mongoose";

export const connectDB = async () => {
  try {
    set("strictQuery", false);
    await connect("mongodb+srv://jcvalencia:Nat2308Jua3112@cluster0.dkgq78x.mongodb.net/?retryWrites=true&w=majority", { dbName: "ecommerce" });

    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
