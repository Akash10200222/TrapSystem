// import mongoose from "mongoose";

// /**
//  * Connect to MongoDB using .env (process.env)
//  */
// export const connectDB = async () => {
//   try {
//     const MONGODB_URI = process.env.MONGODB_URI;

//     if (!MONGODB_URI) {
//       throw new Error("❌ MONGODB_URI is not defined in environment variables");
//     }

//     const conn = await mongoose.connect(MONGODB_URI);

//     console.log("✅ MongoDB connected:", conn.connection.host);
//   } catch (error) {
//     console.error("❌ Error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas
 */
export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    const conn = await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected");
    console.log("🌍 Host:", conn.connection.host);
    console.log("🏷 Database:", conn.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};