const app = require('../app');
const mysql = require('mysql');
const config = require('../config/config.js')[process.env.NODE_ENV];
const session = require('express-session');
const sessionMiddleware = app.session;

const pool = mysql.createPool(config);







module.exports = {
    start: function(io) {

      io.use(function(socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
      });

      io.on('connection', (socket) => {

        console.log('ユーザーが接続しました');

        socket.on('postLikes', (likesData) => {
          console.log("いいねしようとしています" + socket.request.session.userId);
          const userId = likesData.userId;
          const postId = likesData.postId;
          console.log("idを宣言");
          pool.getConnection((error, conn) => {
            conn.query(
              'UPDATE posts SET likes = likes + 1 WHERE id = ?',
              [postId],
              (err2, rows) => {
                conn.release();
              }
            );
            conn.query(
              'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
              [userId, postId],
              (err, rows) => {
                conn.release();
              }
            );
            conn.query(
              'SELECT * FROM posts WHERE id = ?',
              [postId],
              (err, rows) => {
                const data = {
                  likes: rows[0].likes,
                  num: likesData.num
                };
                io.emit('showLikes', data);
                console.log("post_id:" + postId + "に user_id:" + userId + "さんがいいねしました");
                conn.release();
              }
            );
          });
        });

        socket.on('postEdit', (data) => {
          const inputName = data.userName;
          const inputText = data.text;
          console.log('edit' + inputName + "こあら");
          pool.getConnection((error, conn) => {
            conn.query(
              'SELECT * FROM users WHERE user_name = ?',
              [inputName],
              (err, rows) => {
                console.log('きたedit2');
                const userId = rows[0].id;
                conn.query(
                  'INSERT INTO posts (article, user_id) VALUES (?, ?)',
                  [inputText, userId],
                  (err, rows2) => {
                    conn.query(
                      'SELECT posts.*, users.user_name, users.user_icon FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC',
                      (err, rows3) => {
                        if (err) {
                          console.log(err);
                          return false;
                        }
                        console.log("memberPost");
                        io.emit('memberPost', rows3[0]);
                      }
                    )
                    console.log("保存完了" + userId);
                  }
                );
                conn.release();
              }
            );
          });
        });

        socket.on('postReply', (data) => {
          console.log("リプライを保存します")
          const article = data.article;
          const postId = data.postId;
          const userId = data.userId;

          pool.getConnection((error, conn) => {
            conn.query(
              'INSERT INTO comments (article, post_id, user_id) VALUES (?, ?, ?)',
              [article, postId, userId],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  return;
                }
                conn.query(
                  'SELECT comments.*, users.user_name, users.user_icon FROM comments INNER JOIN users ON comments.user_id = users.id ORDER BY comments.id DESC',
                  (err, rows2) => {
                    console.log("返信");
                    io.emit('memberReply', rows2[0]);
                  }
                );
                connection.release();
              }
            );
          });
        });

      });
    }
};
