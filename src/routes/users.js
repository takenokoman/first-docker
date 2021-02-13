const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/api/', function(req, res, next) {
  res.send('proxy');
});

module.exports = router;
