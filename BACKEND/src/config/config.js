import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in env file");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in env file");
}
if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined in env file");
}
if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID is not defined in env file");
}
if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET is not defined in env file");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in env file");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};
