'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('hbs');
var socketIO = require('socket.io');
var MongoClient = require('mongodb').MongoClient;

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var env = process.env.NODE_ENV || 'development';
var username = ''; // 用户名（API KEY）
var password = ''; // 密码(Secret KEY)
var mongodburl = '';
if (env === 'development') {
  mongodburl = 'mongodb://localhost:27017/test?w=1';
  username = 'siteUserAdmin';
  password = 'password';
} else if (env === 'production') {
  mongodburl = 'mongodb://mongo.duapp.com:8908/XurPKKOJMvCxWYWPcqPs?w=1';
  username = 'vLT8N37pp3ojuQyKG2ciFiKq';
  password = '4pCRiG7nrH2V6zPihKh72Dvk087WcTUO';
}

console.log('mongodburl: ' + mongodburl);

MongoClient.connect(mongodburl, function(err, db) {
  db.authenticate(username, password, function(err, result) {
    if (err) {
      db.close();
      throw err;
      return;
    };

    var collection = db.collection('test_tb');

    collection.insert([{
      'tsc': 'bobby'
    }], {
      w: 1
    }, function(docs) {
      console.log('finish...');
    });

    // express config start
    var app = express();

    // baidu cloud nodejs port
    app.set('port', 18080);
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
});
