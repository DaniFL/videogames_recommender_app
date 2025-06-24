const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
// const session = require('express-session');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const { router: userRouter } = require('./routes/user');
const newsRouter = require('./routes/news');
const steamRouter = require('./routes/steam');
const recommendationsRouter = require('./routes/recommendations');
const { poolPromise } = require('./config/db');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS
// app.js
app.use(cors({
  origin: process.env.CLIENT_URL, // Permitir solicitudes desde el frontend
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));
// view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/user', userRouter);
app.use('/news', newsRouter);
app.use('/steam', steamRouter);
app.use('/recommendations', recommendationsRouter);

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

// Verificar la conexión a la base de datos al iniciar el servidor
poolPromise.then(async (pool) => {
    console.log('Conexión a la base de datos verificada');
}).catch(err => {
    console.error('Error al verificar la conexión a la base de datos:', err);
});

module.exports = app;