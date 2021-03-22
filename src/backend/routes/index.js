const express = require('express');
const app = express.Router();
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const io = require('../bin/www');
const multer = require('multer');
const conn = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'first_docker'
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //画像保存場所
    cb(null, path.resolve(__dirname, '../../public/img'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  }
});
const uploader = multer({ storage: storage });

conn.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});


app.post('/register', (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  const createdAt = new Date();
  const hash = bcrypt.hashSync(pass, 10);
  conn.query(
    'INSERT INTO users (user_name, pass, created_at) VALUES (?, ?, ?)',
    [name, hash, createdAt],
    (err, rows) => {
      console.log("registration completed.");
      conn.query(
        'SELECT * FROM users WHERE user_name = ?',
        [name],
        (err2, rows2) => {
          res.json({ name: rows2[0].user_name });
          console.log(name + "さん");
        }
      );
    }
  );
});

app.post('/login', (req, res) => {
  const inputName = req.body.userName;
  const inputPass = req.body.pass;
  console.log('きた');
  conn.query(
    'SELECT * FROM users WHERE user_name = ?',
    [inputName],
    (err, rows) => {
      if (rows.length == 0) {
        return false;
      }
      console.log('きた2');
      const userName = rows[0].user_name;
      const userId = rows[0].id;
      const userIcon = rows[0].user_icon ? rows[0].user_icon : "";
      const pass = rows[0].pass;
      const hash_compare = bcrypt.compareSync(inputPass, pass);
      req.session.userId = userId;
      req.session.userName = userName;
      req.session.userIcon = userIcon;
      req.session.num = 101;
      console.log(req.session);
      if (hash_compare) {
        res.json({ userName: userName, userId: userId, userIcon: userIcon, msg: "", login: true});
        console.log(userName + "さんがログイン" + userIcon);
        const toString = Object.prototype.toString;
        console.log(toString.call(userIcon));
      } else {
        res.json({msg: "ログインに失敗しました", login: false});
        console.log("ログインに失敗しました" + userName );
      }
    }
  )
});

app.get('/edit', (req, res) => {
  // const sess = req.session;
  conn.query(
    'SELECT posts.*, users.user_name, users.user_icon FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC',
    (err, rows) => {
      conn.query(
        'SELECT comments.*, users.user_name, users.user_icon FROM comments INNER JOIN users ON comments.user_id = users.id ORDER BY comments.id DESC',
        (err, rows2) => {
          res.status(200).json({posts: rows, comments: rows2, msg: "投稿を取得しました"});
          console.log(rows.length +　"個の投稿取得/最新の投稿 :" +  rows[0].id);
          console.log(req.session);
        }
      );
    }
  );
});


app.post('/img', uploader.single('file'), (req, res) => {
  const sess = req.session;
  const imgFile = req.file.filename;
  const userId = req.body.id;
  // const userId = req.body.userId;
  console.log(req.file + req.body.id);
  console.log('/img '+ imgFile);
  conn.query(
    'UPDATE users SET user_icon = ? WHERE id = ?',
    [imgFile, userId],
    (err, rows) => {
      console.log(req.session);
      res.json({userIcon: imgFile});
    }

  )
});



module.exports = app;
