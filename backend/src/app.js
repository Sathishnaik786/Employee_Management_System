const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const config = require('@config');
const errorMiddleware = require('@middlewares/error.middleware');

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




app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes (to be added)
app.use('/api/auth', require('./routes/auth.routes'));
// Compatibility route for direct auth access
app.use('/auth', require('./routes/auth.routes'));
app.use('/api/employees', require('./routes/employee.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/leaves', require('./routes/leave.routes'));
app.use('/api/documents', require('./routes/document.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/projects', require('./routes/project.routes'));

app.use('/api/analytics', require('@analytics/analytics.routes'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route not found' });
});

// Error handler
app.use(errorMiddleware);

module.exports = app;
