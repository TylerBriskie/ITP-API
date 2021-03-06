const createError = require('http-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const logger = require('morgan');

// const atlas = require('./config/keys');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const formRouter = require('./routes/form');
const auth = require('./routes/auth');
var app = express();

// MIDDLEWAREZ
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.locals.user = req.cookies.token;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/form', formRouter);
app.use('/auth', auth);

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
  res.render('error');
});

// APP
app.listen(process.env.PORT || 1337, () => {
  mongoose.connect(process.env.DB_CONN_STRING, error => {
    if (error){
      console.error("error: " + error);
    }
    else {
      console.log('connected to db, listening on ');
    }
  })

});

module.exports = app;
