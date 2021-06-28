const express = require('express');
const app = express.Router();
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const io = require('../bin/www');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const pool = mysql.createPool(config);
const { decycle, encycle } = require('json-cyclic');
const Blob = require("cross-blob");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  Bucket: 'first-docker-s3'
});

const storage = multerS3({
  s3: s3,
  bucket: 'first-docker-s3',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const uploader = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

function checkFileType (file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  console.log("check filetype");
  if (mimetype && extname) {
    console.log("success");
    return cb(null, true);
  } else {
    console.log("Error: Images Only!");
    cb('Error: Images Only!');
  }
}


app.post('/register', (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  const hash = bcrypt.hashSync(pass, 10);
  pool.getConnection((error, conn) => {
    conn.query(
      'SELECT * FROM users WHERE user_name = ?',
      [name],
      (err, rows) => {
        if (rows.length) {
          res.json({ name: null, msg: "既に登録されている名前です" });
          console.log("重複しています");
          return false;
        } else {
          conn.query(
            'INSERT INTO users (user_name, pass) VALUES (?, ?)',
            [name, hash],
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
        }
      }
    );
  });

});

app.post('/login', (req, res) => {
  const inputName = req.body.userName;
  const inputPass = req.body.pass;
  console.log('きた');
  pool.getConnection((error, conn) => {
    conn.query(
      'SELECT * FROM users WHERE user_name = ?',
      [inputName],
      (err, rows) => {
        if (rows.length == 0) {
          res.json({msg: "ログインに失敗しました", login: false});
          return false;
        }
        console.log('きた2');
        const userName = rows[0].user_name;
        const userId = rows[0].id;
        const userIcon = rows[0].user_icon ? rows[0].user_icon : null;
        const pass = rows[0].pass;
        const hash_compare = bcrypt.compareSync(inputPass, pass);
        req.session.userId = userId;
        req.session.userName = userName;
        req.session.userIcon = userIcon;
        console.log(req.session);
        console.log(userIcon);

        if (hash_compare) {
          res.json({ userName: userName, userId: userId, msg: "ok", login: true});
          console.log(userName + "さんがログイン" + userIcon);
          const toString = Object.prototype.toString;
          console.log(toString.call(userIcon));
        } else {
          res.json({msg: "ログインに失敗しました", login: false});
          console.log("ログインに失敗しました" + userName );
        }

      }
    );
  });
});

app.get('/edit', (req, res) => {
  console.log("投稿を取得中");
  pool.getConnection((error, conn) => {
    conn.query(
      'SELECT posts.*, users.user_name, users.user_icon FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC',
      (err, rows) => {
        console.log(err);
        conn.query(
          'SELECT comments.*, users.user_name, users.user_icon FROM comments INNER JOIN users ON comments.user_id = users.id ORDER BY comments.id DESC',
          (err, rows2) => {
            if (rows.length == 0) {
              res.json({noPost: true, msg: "投稿はありません"});
              console.log("投稿はありません");
              return;
            }
            res.status(200).json({posts: rows, comments: rows2, noPost: false, msg: "投稿を取得しました"});
            console.log(req.session);
            console.log(rows.length);
          }
        );
        conn.release();
      }
    );
  });
});

app.post('/icon', (req, res) => {
  console.log("/api/icon");
  console.log(req.body.userId);
  pool.getConnection((error, conn) => {
    conn.query(
      'SELECT user_icon FROM users WHERE id = ?',
      [req.body.userId],
      (err, rows) => {
        if (err) {
          console.log(err);
          return false;
        }
        console.log(rows[0].user_icon);
        const params = {Key: rows[0].user_icon, Bucket: 'first-docker-s3'};
        s3.getObject(params, (err2, data) => {
          if (err2) {
            console.log(err2);
            res.send("noImage");
            return false;
          }
          const toString = Object.prototype.toString;
          const u8 = data.Body;
          const arrayBuffer = u8.buffer;
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          console.log("型 " + toString.call(data.Body));
          console.log(data.Body);
          console.log("型 " + toString.call(arrayBuffer));
          console.log(arrayBuffer);
          console.log("型 " + toString.call(blob));
          console.log(Object.keys(blob));
          console.log(blob);
          console.log(blob.size);
          console.log(blob.type);
          res.send(data.Body);
        });
        conn.release();
      }
    );
  });

});

app.post('/img', uploader.single('file'), (req, res) => {
  const sess = req.session;
  const imgFile = req.file.key;
  const userId = req.body.id;
  console.log(req.file + req.body.id);
  console.log('/img '+ imgFile);
  pool.getConnection((error, conn) => {
    conn.query(
      'UPDATE users SET user_icon = ? WHERE id = ?',
      [imgFile, userId],
      (err, rows) => {
        if (err) {
          console.log(err);
          return false;
        }
        console.log(req.session);
        res.json({userIcon: req.file});
        conn.release();
      }
    );
  });
});



module.exports = app;
