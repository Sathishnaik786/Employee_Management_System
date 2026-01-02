const app = require('./app');

const PORT = process.env.PORT || 3003;

console.log('Attempting to start server...');

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is actually listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
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
