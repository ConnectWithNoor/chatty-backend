import mongoose from "mongoose";
import { config } from "./config";

const log = config.createLogger("setupDatabase");

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URI!)
      .then(() => {
        log.info("Successfully connected to the database");
      })
      .catch((error) => {
        log.error(`Error connecting database: ${error}`);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on("disconnected", () => {
    log.info("Database connection retrying");
    connect();
  });
};
