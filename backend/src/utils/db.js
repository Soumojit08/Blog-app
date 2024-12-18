import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting in Mongo ${error}`);
    process.exit(1)
  }
};
