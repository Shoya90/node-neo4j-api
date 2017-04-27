var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v2;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var apiController = require('./controllers/apiController');
var userController = require('./controllers/userController');
var port = require('./config/config').port;


var app = express();

//MIDDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

//PASSPORT MIDDLEWARES
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//ROUTER
app.use('/api', apiController);
app.use('/user', userController);

//PORT LISTENING
app.listen(port, function(){
  console.log('server is running on port ' + port + '...');
});

module.exports = app;
