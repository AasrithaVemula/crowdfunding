import mongoose from "mongoose";

const connectDB = async () => {
  const uri = "mongodb+srv://aasrithavemula_db_user:yV11MzQmBZx1f0Ck@cluster0.i0jhtil.mongodb.net/kicker";

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

export default connectDB;
