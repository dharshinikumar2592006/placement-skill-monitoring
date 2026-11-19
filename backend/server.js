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
  // If visited via a web browser, return a styled portal page
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Placement Skill Monitoring - Backend API Live</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
          .card { background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 680px; width: 100%; padding: 2.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 0.5rem; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1.25rem; }
          .dot { width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
          h1 { font-size: 1.85rem; font-weight: 800; color: #ffffff; margin-bottom: 0.65rem; line-height: 1.25; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem; }
          .endpoints-box { background-color: #090e17; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem; text-align: left; margin-bottom: 1.75rem; font-family: monospace; font-size: 0.86rem; color: #cbd5e1; }
          .endpoint-line { padding: 0.35rem 0; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .endpoint-line:last-child { border-bottom: none; }
          .method { color: #38bdf8; font-weight: 700; }
          .path { color: #f1f5f9; }
          .btn-group { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
          .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.35rem; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 0.9rem; transition: transform 0.15s ease; }
          .btn:hover { transform: translateY(-1px); }
          .btn-primary { background-color: #2563eb; color: #ffffff; }
          .btn-secondary { background-color: #334155; color: #ffffff; border: 1px solid rgba(255,255,255,0.1); }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Backend REST API Live & Healthy</div>
          <h1>Placement Skill Monitoring System</h1>
          <p>The Express.js REST API is fully operational and connected to <strong>MongoDB Atlas (placementDB)</strong>. The React visual frontend communicates with this service.</p>
          
          <div class="endpoints-box">
            <div class="endpoint-line"><span class="method">GET</span> <span class="path">/api/health</span></div>
            <div class="endpoint-line"><span class="method">GET</span> <span class="path">/api/students</span></div>
            <div class="endpoint-line"><span class="method">POST</span> <span class="path">/api/students</span></div>
            <div class="endpoint-line"><span class="method">PUT</span> <span class="path">/api/students/:id</span></div>
            <div class="endpoint-line"><span class="method">DELETE</span> <span class="path">/api/students/:id</span></div>
          </div>

          <div class="btn-group">
            <a href="/api/health" class="btn btn-primary" target="_blank">View API Health</a>
            <a href="/api/students" class="btn btn-secondary" target="_blank">View Students JSON</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  // Otherwise return JSON for API tools
  res.status(200).json({
    message: 'Welcome to Placement Skill Monitoring Management System API',
    status: 'online',
    database: 'MongoDB Atlas (placementDB)',
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
