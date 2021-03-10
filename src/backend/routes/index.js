const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
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
    cb(null, path.resolve(__dirname, '../../public/img'));
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
    // const name = Common.makeFileName(uniqueSuffix,file.mimetype);
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

app.get('/as', (req, res) => {
  res.sendFile("../public/index.html");
  console.log("きてるよ");
});

app.post('/api/register', (req, res) => {
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

app.post('/api/login', (req, res) => {
  const inputName = req.body.userName;
  const inputPass = req.body.pass;
  console.log('きた');
  conn.query(
    'SELECT * FROM users WHERE user_name = ?',
    [inputName],
    (err, rows) => {
      console.log('きた2');
      const userName = rows[0].user_name;
      const userId = rows[0].id;
      const userIcon = rows[0].user_icon;
      const pass = rows[0].pass;
      const hash_compare = bcrypt.compareSync(inputPass, pass);
      if (hash_compare) {
        res.json({ userName: userName, userId: userId, userIcon: userIcon, msg: "", login: true});
        console.log(userName + "さんがログイン");
      } else {
        res.json({msg: "ログインに失敗しました", login: false});
        console.log("ログインに失敗しました" + userName );
      }
    }
  )
});
app.post('/api/edit', (req, res) => {
  const inputName = req.body.userName;
  const inputText = req.body.text;
  const createdAt = new Date();
  console.log('きたedit' + inputName + "こあら");
  conn.query(
    'SELECT * FROM users WHERE user_name = ?',
    [inputName],
    (err, rows) => {
      console.log('きたedit2');
      const userId = rows[0].id;
      conn.query(
        'INSERT INTO posts (article, user_id, created_at) VALUES (?, ?, ?)',
        [inputText, userId, createdAt],
        (err2, rows2) => {
          res.json({msg: "投稿できました"});
          console.log("保存完了" + userId + "神" + createdAt);
        }
      );
    }
  );
});
app.get('/api/edit', (req, res) => {
  conn.query(
    'SELECT posts.*, users.user_name, users.user_icon FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC',
    (err, rows) => {
      res.json({posts: rows, msg: "投稿を取得しました"});
      console.log("保存完了神2" + rows.length + rows[0].article);
    }
  );
});
app.post('/api/likes', (req, res) => {
  console.log("いいねしようとしています");
  const createdAt = new Date();
  const userId = req.body.userId;
  const postId = req.body.postId;
  console.log("idを宣言");
  conn.query(
    'UPDATE posts SET likes = likes + 1 WHERE id = ?',
    [postId],
    (err2, rows2) => {
      conn.query(
        'INSERT INTO likes (created_at, user_id, post_id) VALUES (?, ?, ?)',
        [createdAt, userId, postId],
        (err, rows) => {
          res.json({msg: "いいねしました"});
          console.log("post_id:" + postId + "に user_id:" + userId + "さんがいいねしました");
        }
      );
    }
  )
});
app.get('/api/likes/:postId', (req, res) => {
  console.log("きたよ");
  const postId = req.params.postId;
  console.log(postId);
  conn.query(
    'SELECT * FROM likes WHERE post_id = ?',
    [postId],
    (err, rows) => {
      const likes = rows.length;
      res.json({likes: likes});
      console.log(postId + "のいいねの数" + likes);
    }
  );
});

app.post('/api/img', uploader.single('file'), (req, res) => {
  const imgFile = req.file.filename;
  const userId = req.body.id;
  // const userId = req.body.userId;
  console.log(req.file + req.body.id);
  console.log('/api/img '+ imgFile);
  conn.query(
    'UPDATE users SET user_icon = ? WHERE id = ?',
    [imgFile, userId],
    (err, rows) => {

    }

  )
});




module.exports = app;
