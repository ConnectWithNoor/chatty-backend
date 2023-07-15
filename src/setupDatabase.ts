import mongoose from "mongoose";

export default () => {
  const connect = () => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/chatty-db")
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
