// const mongoose = require('mongoose');

// async function ConnectionToMongoDB(url){
// return mongoose.connect(url);
// }
// module.exports= {ConnectionToMongoDB};

const mongoose= require ('mongoose');
const dotenv= require ('dotenv');

dotenv.config();
const database = process.env.DB_name;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: database
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;