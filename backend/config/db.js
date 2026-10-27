const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${primaryUri}): ${err.message}`);
    console.log('[MongoDB] Starting in-memory MongoDB server for development/testing...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: { launchTimeout: 60000 },
      });
      const inMemoryUri = mongodInstance.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] In-memory MongoDB connected: ${inMemoryUri}`);

      // Seed data automatically if newly spun up in-memory instance
      const { autoSeedIfEmpty } = require('../seed/seeder');
      await autoSeedIfEmpty();

      return conn;
    } catch (inMemoryErr) {
      console.error(`[MongoDB] Fatal: Failed to initialize in-memory database: ${inMemoryErr.message}`);
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
