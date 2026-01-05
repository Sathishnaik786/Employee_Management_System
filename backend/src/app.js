const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const config = require('@config');
const errorMiddleware = require('@middlewares/error.middleware');
const logger = require('./lib/logger');
const loggingMiddleware = require('./middlewares/logger.middleware');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Production-safe allowlist for CORS
    const allowedOrigins = config.NODE_ENV === 'production'
      ? ['https://yviems.netlify.app', config.FRONTEND_URL]
      : [
          'http://localhost:8080',
          'http://127.0.0.1:8080',
          'http://localhost:8081',
          'http://127.0.0.1:8081',
          'http://localhost:8082',
          'http://127.0.0.1:8082',
          'http://localhost:8080',
          'http://127.0.0.1:8080',
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:3003',
          'http://127.0.0.1:3003',
          'http://localhost:3002',
          'http://127.0.0.1:3002',
          'http://localhost:5174',
          'http://127.0.0.1:5174'
        ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1;
    callback(null, isAllowed);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middlewares
app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));

// Compression middleware (gzip responses)
app.use(compression());

// Structured logging middleware (before routes)
app.use(loggingMiddleware);

// HTTP request logging (morgan - for compatibility)
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cache middleware (optional - can be applied per route)
const { cacheMiddleware } = require('./middlewares/cache.middleware');

// Routes (to be added)
app.use('/api/auth', require('./routes/auth.routes'));
// Compatibility route for direct auth access
app.use('/auth', require('./routes/auth.routes'));

// Apply cache middleware to employee routes (GET requests only)
app.use('/api/employees', cacheMiddleware(), require('./routes/employee.routes'));
app.use('/employees', cacheMiddleware(), require('./routes/employee.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/departments', require('./routes/department.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/attendance', require('./routes/attendance.routes'));
app.use('/api/leaves', require('./routes/leave.routes'));
app.use('/leaves', require('./routes/leave.routes'));
app.use('/api/documents', require('./routes/document.routes'));
app.use('/documents', require('./routes/document.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/reports', require('./routes/report.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/projects', require('./routes/project.routes'));

app.use('/api/analytics', require('@analytics/analytics.routes'));
app.use('/analytics', require('@analytics/analytics.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Health check routes
app.use('/health', require('./routes/health.routes'));

// Redis test endpoint (for development/testing)
app.get('/redis-test', async (req, res) => {
    try {
        const { redis } = require('@lib/redis');
        await redis.set('health', 'ok', 'EX', 10);
        const value = await redis.get('health');
        res.status(200).json({ 
            redis: value, 
            status: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            redis: null,
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Cache stats endpoint (for monitoring)
app.get('/cache-stats', async (req, res) => {
    try {
        const CacheService = require('./services/cache.service');
        const stats = await CacheService.getStats();
        res.status(200).json({ 
            success: true,
            ...stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route not found' });
});

// Error handler with structured logging
app.use((err, req, res, next) => {
  // Log error with structured logger
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    role: req.user?.role,
    ip: req.ip
  });
  
  // Use existing error middleware
  errorMiddleware(err, req, res, next);
});

module.exports = app;
