require('dotenv').config();
require('module-alias/register');
const app = require('./app');
const config = require('@config');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { redis } = require('@lib/redis');

const PORT = process.env.PORT || config.PORT || 3003;

console.log('Attempting to start server...');

const server = http.createServer(app);

// CORS origins configuration
const corsOrigins = config.NODE_ENV === 'production'
  ? [config.FRONTEND_URL, 'https://yviems.netlify.app'].filter(Boolean)
  : [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:8082',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];

const io = new Server(server, {
    cors: {
        origin: corsOrigins,
        credentials: true
    },
    transports: ['websocket', 'polling'],
    // Add Redis adapter for horizontal scaling
    adapter: createAdapter(redis, redis.duplicate())
});

// Initialize socket handlers
const SocketHandlers = require('./socketHandlers');
SocketHandlers.initialize(io);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is actually listening on port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`WebSocket server initialized with Redis adapter`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please kill the process using it or use a different port.`);
    } else {
        console.error('Server error:', error);
    }
});

// Prevent immediate exit
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
