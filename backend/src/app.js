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

/**
 * IERS - Integrated Resource & Education System
 * Main Application Configuration
 */

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = config.NODE_ENV === 'production'
      ? ['https://elms-hub.netlify.app', config.FRONTEND_URL] // Note: Change to iers URL in production
      : [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3003',
        'http://127.0.0.1:3003'
      ];

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
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: 'Too many requests from this IP.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many login attempts.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(loggingMiddleware);

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORE ROUTES ---

// Auth System (IERS Refactored)
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/health', require('./routes/health.routes'));

// --- IERS MODULES ---

// 1. System & RBAC
app.use('/api/iers/system', generalLimiter, require('./modules/iers/system/system.routes'));

// 2. Academic Masters
app.use('/api/iers/students', generalLimiter, require('./modules/iers/student/student.routes'));
app.use('/api/iers/faculty', generalLimiter, require('./modules/iers/faculty/faculty.routes'));

// 3. PhD Lifecycle & Academic Workflows
app.use('/api/iers/phd', generalLimiter, require('./modules/iers/phd/phd.routes'));
app.use('/api/iers/workflows', generalLimiter, require('./modules/iers/workflow/workflow.routes'));
app.use('/api/iers/rac', generalLimiter, require('./modules/iers/rac_rrc/rac.routes'));
app.use('/api/iers/rrc', generalLimiter, require('./modules/iers/rac_rrc/rrc.routes'));

// 4. Institutional & Compliance (NAAC)
app.use('/api/iers/naac/iiqa', generalLimiter, require('./modules/iers/naac/iiqa.routes'));
app.use('/api/iers/naac/ssr', generalLimiter, require('./modules/iers/naac/ssr.routes'));
app.use('/api/iers/naac/dvv', generalLimiter, require('./modules/iers/naac/dvv.routes'));

// 5. Career & Growth
app.use('/api/iers/placement', generalLimiter, require('./modules/iers/placement_training/placement.routes'));
app.use('/api/iers/training', generalLimiter, require('./modules/iers/placement_training/training.routes'));

// --- INFRASTRUCTURE ---

// Redis test endpoint
app.get('/redis-test', async (req, res) => {
  try {
    const { redis } = require('@lib/redis');
    await redis.set('iers-health', 'ok', 'EX', 10);
    const value = await redis.get('iers-health');
    res.status(200).json({ status: 'connected', redis: value });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'IERS API Endpoint Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('IERS_SYSTEM_ERROR', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id
  });
  errorMiddleware(err, req, res, next);
});

// --- PERMISSION INTEGRITY CHECK (STARTUP) ---
if (false && config.NODE_ENV !== 'production') {
  setTimeout(() => {
    logger.info('--- IERS PERMISSION INTEGRITY SCAN ---');
    const unprotectedRoutes = [];

    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Simple routes
      } else if (middleware.name === 'router') {
        // Router modules
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods);
            const hasPermissionMiddleware = handler.route.stack.some(s =>
              s.name === 'authorize' || s.name === 'checkPermission'
            );

            if (!hasPermissionMiddleware && !path.includes('auth') && !path.includes('health') && path !== '/') {
              unprotectedRoutes.push(`${methods.join(',').toUpperCase()} ${path}`);
            }
          }
        });
      }
    });

    if (unprotectedRoutes.length > 0) {
      logger.warn('PERM_INTEGRITY_ALERT: Unprotected business endpoints detected!', { routes: unprotectedRoutes });
    } else {
      logger.info('✅ All business endpoints are protected by protocol-based authorization.');
    }
  }, 1000);
}

module.exports = app;

