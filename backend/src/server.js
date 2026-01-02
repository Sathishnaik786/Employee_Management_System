const app = require('./app');
const config = require('./config/index.js');

const PORT = process.env.PORT || config.PORT || 3003;

console.log('Attempting to start server...');

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is actually listening on port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
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
