const mongoose = require('mongoose');
const config = require('config');
const colors = require('colors');

const db =
  process.env.NODE_ENV === 'production' && process.env.INSTANCE !== 'beta'
    ? config.get('mongoURI_prod')
    : config.get('mongoURI_dev');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB Connected'.cyan.bold);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
