import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_number_one';

  try {
    // Attempt standard connection with 2 second timeout for local fallback
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoose.connection.host}`);
    return { type: 'local', uri };
  } catch (err) {
    console.warn(`⚠️ Standard MongoDB connection failed (${err.message}). Starting MongoMemoryServer in-memory database...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'campus_number_one',
        }
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`🚀 In-Memory MongoDB Connected at: ${memoryUri}`);
      return { type: 'memory', uri: memoryUri };
    } catch (memErr) {
      console.error('❌ Critical: Failed to start both local and in-memory MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
