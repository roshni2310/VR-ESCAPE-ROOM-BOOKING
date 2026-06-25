require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan(process.env.LOG_FORMAT || 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vr-escape-room')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});


// Routes (to be implemented)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/rooms', require('./routes/rooms'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/waivers', require('./routes/waivers'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    requestId: req.id
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
