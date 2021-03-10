const express = require('express');
const router = express.Router();
const app = express();
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

app.post('/api/edit', (req, res) => {
  const inputName = req.body.name;
  const inputText = req.body.text;
  const createdAt = new Date();
  console.log('きたedit');
  connection.query(
    'SELECT * FROM users WHERE user_name = ?',
    [inputName],
    (err, rows) => {
      console.log('きたedit2');
      const userId = rows[0].user_id;
      connection.query(
        'INSERT INTO posts (text, user_id, created_at) VALUES (?, ?, ?)',
        [inputText, userId, createdAt],
        (err2, rows2) => {
          res.json({msg: "投稿できました"});
        }
      );
    }
  );
});

module.exports = app;
