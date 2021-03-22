const createError    = require('http-errors');
const express        = require('express');
const path           = require('path');
const logger         = require('morgan');
const socket_io      = require( "socket.io" );
const expressSession = require('express-session');
const mysqlStore     = require('express-mysql-session')(expressSession);



const app         　 = express();


// view engine setup
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials" , true);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Max-Age", "3600");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, x-access-token, x-user-id,Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  console.log("返事が聞こえないぞ...GJJJ...");
  next();
});

//セッション
const options = {
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'first_docker'
};
const sessionStore = new mysqlStore(options);
// const sessionStore = new expressSession.MemoryStore();
const session = expressSession({
  store: sessionStore,
  secret: 'catIsKawaii', // 環境変数で設定などする。今回は省略して固定値
  resave: true,
  saveUninitialized: true,
  rolling: true,
  proxy: true, // reverse proxy経由などの場合はtrueにする。環境で分けるようにする。今回は省略
  cookie: {
    secure: false, // httpsならtrueにする。環境で分けるなどする。今回は省略
    httpOnly: true,
    rolling: true,
    maxAge: 1000 * 60 * 30, // ミリ秒で指定。環境変数で設定するべきだが、今回は省略
  },
});
app.session = session;
app.use(session);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
// const editRouter = require('./routes/edits');

app.use('/api', indexRouter);
// app.use('/users', usersRouter);
// app.use('/edits', editRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log("メッセージ:" + res.locals.message);
  console.log("エラー:" + res.locals.error)
});

module.exports = app;
