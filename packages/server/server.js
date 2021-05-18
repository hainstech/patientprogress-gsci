const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

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
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.green.bold
  )
);

// tutorial https://learning.oreilly.com/videos/node-js-api-masterclass/
