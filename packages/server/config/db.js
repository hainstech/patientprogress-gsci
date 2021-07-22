const mongoose = require('mongoose');
const config = require('config');
const colors = require('colors');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const useProdDB =
  process.env.NODE_ENV === 'production' && process.env.INSTANCE !== 'beta';

console.log(process.env.NODE_ENV, process.env.INSTANCE);

const db = useProdDB ? config.get('mongoURI_prod') : config.get('mongoURI_dev');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(
      `MongoDB Connected to ${useProdDB ? 'Production' : 'Development'}`.cyan
        .bold
    );
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
