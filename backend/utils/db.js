const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // maxPoolSize increased to 50 to comfortably handle ~150 concurrent attendance
    // scan requests without connection queuing delays. The default of 5-10 would
    // cause requests to wait for a free connection under burst traffic.
    const conn = await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 50 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
