const app = require('../app.js');
const http = require('http');
const server = http.createServer(app);
/**
 * Get port from environment and store in Express.
 */
module.exports = server;
