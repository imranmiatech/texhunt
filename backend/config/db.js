import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows & local ISP DNS failure with MongoDB SRV records (only on local Windows)
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (error) {
    console.log("DNS setServers notice:", error.message);
  }
}

let cachedConnection = null;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || process.env.url;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Format URI so database name (/e-commerce) is placed before any query parameters
  let connectionString = uri.trim();
  if (!connectionString.includes('/e-commerce')) {
    if (connectionString.includes('?')) {
      const [base, query] = connectionString.split('?');
      connectionString = `${base.replace(/\/$/, '')}/e-commerce?${query}`;
    } else {
      connectionString = `${connectionString.replace(/\/$/, '')}/e-commerce`;
    }
  }

  try {
    cachedConnection = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("DB Connected successfully");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("DB Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;