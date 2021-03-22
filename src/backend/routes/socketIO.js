const app = require('../app');
const mysql = require('mysql');
const session = require('express-session');
const sessionMiddleware = app.session;

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

module.exports = {
    start: function(io) {
      io.use(function(socket, next){
        sessionMiddleware(socket.request, socket.request.res, next);
      });

      io.on('connection', (socket) => {

        console.log('ユーザーが接続しました');

        socket.on('postLikes', (likesData) => {
          console.log("いいねしようとしています" + socket.request.session.userId);
          const createdAt = new Date();
          const userId = likesData.userId;
          const postId = likesData.postId;
          console.log("idを宣言");
          connection.query(
            'UPDATE posts SET likes = likes + 1 WHERE id = ?',
            [postId],
            (err2, rows) => {
            }
          );
          connection.query(
            'INSERT INTO likes (created_at, user_id, post_id) VALUES (?, ?, ?)',
            [createdAt, userId, postId],
            (err, rows) => {
            }
          );
          connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [postId],
            (err, rows) => {
              const data = {
                likes: rows[0].likes,
                num: likesData.num
              };
              io.emit('showLikes', data);
              console.log("post_id:" + postId + "に user_id:" + userId + "さんがいいねしました");

            }
          )
        });

        socket.on('postEdit', (data) => {
          const inputName = data.userName;
          const inputText = data.text;
          const createdAt = new Date();
          console.log('きたedit' + inputName + "こあら");
          connection.query(
            'SELECT * FROM users WHERE user_name = ?',
            [inputName],
            (err, rows) => {
              console.log('きたedit2');
              const userId = rows[0].id;
              connection.query(
                'INSERT INTO posts (article, user_id, created_at) VALUES (?, ?, ?)',
                [inputText, userId, createdAt],
                (err, rows2) => {
                  connection.query(
                    'SELECT posts.*, users.user_name, users.user_icon FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC',
                    (err, rows3) => {

                      io.emit('memberPost', rows3[0]);
                    }
                  )
                  console.log("保存完了" + userId + "神" + createdAt);
                }
              );
            }
          );
        });

        socket.on('postReply', (data) => {
          console.log("リプライを保存します")
          const article = data.article;
          const postId = data.postId;
          const userId = data.userId;
          const createdAt = new Date();

          connection.query(
            'INSERT INTO comments (article, post_id, user_id, created_at) VALUES (?, ?, ?, ?)',
            [article, postId, userId, createdAt],
            (err, rows) => {
              if (err) {
                console.log(err);
                return;
              }
              connection.query(
                'SELECT comments.*, users.user_name, users.user_icon FROM comments INNER JOIN users ON comments.user_id = users.id ORDER BY comments.id DESC',
                (err, rows2) => {
                  console.log("返信");
                  io.emit('memberReply', rows2[0]);
                }
              );
            }
          );
        })

      });
    }
};
