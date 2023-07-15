import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URI!)
      .then(() => {
        console.log("Successfully connected to the database");
      })
      .catch((error) => {
        console.log(`Error connecting database: ${error}`);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on("disconnected", () => {
    console.log("Database connection retrying");
    connect();
  });
};
