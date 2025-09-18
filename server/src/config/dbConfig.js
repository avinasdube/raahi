import mongoose from "mongoose";

// connecting to mongodb atlas database
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `🍃 MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error);
    process.exit(1);
  }
};

export default connectDB;
