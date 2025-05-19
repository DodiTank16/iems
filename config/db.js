const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

// Function connects to the mongoDB cloud database using credenrials
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    //
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
