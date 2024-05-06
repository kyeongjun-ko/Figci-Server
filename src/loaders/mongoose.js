const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const CONFIG = require("../constants/config");
const CONSTANT = require("../constants/constants");

let bucket;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_ENDPOINT, { dbName: CONFIG.DB_NAME });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

const initBucket = async () => {
  const db = mongoose.connection.client.db();
  bucket = new GridFSBucket(db, { bucketName: CONSTANT.BUCKET_NAME });
};

const mongooseLoader = async () => {
  await connectToMongoDB();
  await initBucket();
};

const getBucket = () => bucket;

module.exports = { mongooseLoader, getBucket };
