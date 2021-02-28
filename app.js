const express = require('express');
const mongoose = require('mongoose');
var path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const logger = require('morgan');
var createError = require('http-errors');

const auth = require('./auth')

require('dotenv').config();
const cors = require('cors');


const port = process.env.PORT || 1337
const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());

app.post('/login', auth.authenticate, auth.login)
app.use('/',indexRouter);
app.use('/users', auth.ensureAdmin, usersRouter);
//app.use('/classdetails', auth.ensureAdmin,classDetailsRouter);
app.use('/products',productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

/*
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})
*/
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(port, () =>
    console.log(`Server listening on port ${port}`)
)


module.exports = app;
