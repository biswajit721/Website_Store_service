import mongoose from "mongoose";

async function DBConnection() {
  try {
    const url = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;

    console.log("Mongo url:", url); 

    const dbConnected = await mongoose.connect(url);

    console.log("MongoDB Connected Successfully!");
    console.log("Host:", dbConnected.connection.host);

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
} 

export default DBConnection;
