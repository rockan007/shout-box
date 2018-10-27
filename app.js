const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const entries = require('./routes/entries');
const validate = require('./middleware/validate'); //验证中间件
const app = express();
//设置json格式
app.set('json spaces', 2);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); //输出有颜色区分的日志，以便于开发调试
app.use(express.json()); //解析请求主体
app.use(express.urlencoded({
  extended: true
})); //扩展消息解析体
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //提供./public下的静态文件

app.get('/', entries.list); //指定程序路由
app.use('/users', usersRouter); //指定程序路由
app.get('/post', entries.form); //请求表单路由
app.post('/post',
  validate.required('entries[title]'),
  validate.lengthAbove('entries[title]', 4),
  entries.submit); //提交表单路由

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; //只有在开发模式下，才返回错误信息

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;