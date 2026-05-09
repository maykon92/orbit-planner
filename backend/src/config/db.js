import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUser = process.env.DB_USER;
    const dbPassword = encodeURIComponent(process.env.DB_PASS);

    const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.auddiwl.mongodb.net/orbit-planner?retryWrites=true&w=majority&appName=Cluster0`;

    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("ERROR CONNECTING DB:", error.message);
    process.exit(1);
  }
};

export default connectDB;