import mongoose from "mongoose"

const connectToDb = async () => {
  await mongoose
    .connect(`${process.env.MONGO_URI}/expenseTracker`)
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch(() => {
      console.log("Mongo error");
    });
};

export default connectToDb;