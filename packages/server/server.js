const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const { startBot } = require('./telegramBot');
const { startSender } = require('./questionnaireSender');
const { startDeleter } = require('./trustedIpsDeleter');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(require('express-status-monitor')());

// Connect database
connectDB();

// Load env variables
dotenv.config({ path: './config/config.env' });

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}

// Prevent http param pollution
app.use(hpp());

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/patients', require('./routes/api/patients'));
app.use('/api/professionals', require('./routes/api/professionals'));
app.use('/api/questionnaires', require('./routes/api/questionnaires'));
app.use('/api/seeding', require('./routes/api/seeding'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.green.bold
  )
);

startSender();

if (process.env.NODE_ENV === 'production') {
  startBot();
  startDeleter();
}
