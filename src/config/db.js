const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const { MONGODB_URI } = process.env;

// Connect to MongoDB
const connectToDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB');

  } catch (error) {
    console.log(error);
  }
}

connectToDb();