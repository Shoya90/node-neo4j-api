var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;
var apiController = require('./controllers/apiController');
var port = require('./config/config').port;

var app = express();

//MIDDLEWARE
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

//ROUTER
app.use('/api', apiController);

//PORT LISTENING
app.listen(port, () => {
  console.log('server is running on port ' + port + '...');
});

module.exports = app;
