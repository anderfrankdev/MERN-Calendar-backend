import mongoose from "mongoose";
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN as string);

    console.log("Data base runnig");
  } catch (err) {
    console.log(err);
    //throw new Error("Connection error")
  }
};

export default dbConnection;
