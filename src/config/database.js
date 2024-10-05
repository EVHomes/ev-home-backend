import mongoose from "mongoose";
import config from "./config.js";

const animeTech = config.DB_URL;

const connectDatabase = async () => {
  try {
    await mongoose.connect(animeTech);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Couldn't connect to MongoDB:", error);
  }
};
export default connectDatabase;
