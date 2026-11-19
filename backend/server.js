const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express application
const app = express();

// Connect to MongoDB Atlas (or local database fallback)
connectDB();

// Middleware configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Placement Skill Monitoring API is running smoothly',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Placement Skill Monitoring Management System API',
    endpoints: {
      health: 'GET /api/health',
      allStudents: 'GET /api/students',
      singleStudent: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id'
    }
  });
});

// Mount student routes
app.use('/api/students', studentRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Placement Skill Monitoring Server running on port ${PORT}`);
  console.log(` Health check available at: http://localhost:${PORT}/api/health`);
  console.log(` Students API available at: http://localhost:${PORT}/api/students`);
  console.log(`====================================================`);
});
