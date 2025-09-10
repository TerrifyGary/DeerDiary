import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

declare global {
  var mongooseConnection: Promise<typeof mongoose> | null;
}

let cachedConnection = global.mongooseConnection;

async function dbConnect() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedConnection) {
    const opts = {
      bufferCommands: false,
    };

    cachedConnection = mongoose.connect(MONGODB_URI as string, opts);
  }
  global.mongooseConnection = cachedConnection; // Cache the promise
  return cachedConnection;
}

export default dbConnect;
