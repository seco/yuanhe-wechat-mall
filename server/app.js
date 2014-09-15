'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('hbs');
var socketIO = require('socket.io');
var mongoose = require('mongoose');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// start mongoose
mongoose.connect('mongodb://localhost/sit');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {

  /* test schema */
  var testSchema = new mongoose.Schema({
    test: String
  });

  var Test = mongoose.model('test', testSchema);

  var app = express();

  app.set('port', 9000);
  app.set('view engine', 'hbs');
  // app.set('views', __dirname + '../app/scripts/views');
  app.set('views', __dirname + '/views');

  // simple log
  app.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
  });

  // mount static
  app.use(express.static(path.join(__dirname, '../app')));


  // route index.html
  app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../app/index.html'));
  });

  //handle 404 error
  app.use(function(req, res, next) {
    res.render('404', {
      status: 404,
      url: req.url
    });
  });

  app.use(function(err, req, res, next) {
    res.render('500', {
      status: err.status || 500,
      error: err
    });
  });

  // start server
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express App started!');
  });
});
