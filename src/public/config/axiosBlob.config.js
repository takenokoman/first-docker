const env = process.env.NODE_ENV || 'development';
const endpoint = require('./port.config.js')[env];

module.exports = {
  baseURL: endpoint,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  responseType: 'arraybuffer'
};
