/*
 * shut down the strict mode to access full
 * function of meta programming
 */

//'use strict';

// generated by marionette scoffold
var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('hbs');
var socketIO = require('socket.io');
var MongoClient = require('mongodb').MongoClient;

// add from express@4.8.0 scaffold
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// load settings to local variables
var settings = require('./settings');
for (var key in settings) { eval("var " + key + " = '" + settings[key] + "'"); }

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
    // mount static
    app.use(express.static(path.join(__dirname, '../app')));
    // view engine
    app.set('view engine', 'hbs');
    // app.set('views', __dirname + '../app/scripts/views');
    app.set('views', __dirname + '/views');

    // simple log
    app.use(function(req, res, next) {
      console.log('%s %s', req.method, req.url);
      next();
    });


    // route index.html
    app.get('/', function(req, res) {
      res.render('index');
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
