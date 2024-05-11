const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const CONFIG = require("../constants/config");
const CONSTANT = require("../constants/constants");

let bucket;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_ENDPOINT, { dbName: CONFIG.DB_NAME });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    throw error;
  }
};

const initBucket = async () => {
  const db = mongoose.connection.client.db(CONFIG.DB_NAME);

  bucket = new GridFSBucket(db, { bucketName: CONSTANT.BUCKET_NAME });
};

const mongooseLoader = async () => {
  await connectMongoDB();
  await initBucket();
};

const getBucket = () => bucket;

module.exports = { mongooseLoader, getBucket };
