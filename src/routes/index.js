const express = require('express');
const router = express.Router();
const app = require('../app');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'first_docker'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

router.get('/', (req, res) => {
  res.render('index.html');
  connection.query(
    'SELECT * FROM users',
    (err, rows) => {
      console.log(rows[0].user_name);
    }
  )
});

router.get('/api/a', function(req, res, next) {
  res.send('proxy');
});

module.exports = router;
