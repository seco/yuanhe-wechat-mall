/**
 * This module aims to handler any auth request.
 *
 * @author Bobby Tang
 */
var app = require('../app');
var dbProxy = app.get('dbProxy');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../lib/util/log').getLogger(__filename);

exports.checkAuth = function(req, res, next) {
  if (req.session && req.session.role_name) {
    // add res.locals, this will make sure each page can reach session data
    res.locals.act_displayname = req.session.act_displayname;
    res.locals.role_name = req.session.role_name;
    next();
  } else {
    logger.warn('fail to login due to lack of auth');
    res.render('login');
  }
};

exports.login = function(req, res, next) {
  res.render('login');
};

exports.signin = function(req, res, next) {
  var act_name = req.body.act_name;
  var act_password = req.body.act_password;
  var remember_me = req.body.remember_me;
  var role_name = '';
  var locals = {};
  if (!req.session.role_name) {
    dbProxy.collection('accounts', function(err, col) {
      col.findOne({
        act_name: act_name,
        act_password: act_password
      }, function(err, doc) {
        if (doc && doc.role_name) {
          role_name = doc.role_name;
          req.session.act_name = doc.act_name;
          req.session.act_password = doc.act_password;
          req.session.role_name = doc.role_name;
          req.session.act_displayname = doc.act_displayname;
          logger.info('account[_id=' + doc._id + ', act_name=' + doc.act_name + '] has signed in successfully, then render to index page.');
          res.render('index', doc);
        } else {
          logger.info('no act_name[' + act_name + '] has been found, render to login page.');
          res.render('login', {
            status: 'error',
            errMsg: '用户名或者密码不正确，请重新输入。'
          });
        }

      });
    });
  };

};

exports.signout = function(req, res, next) {
  logger.info('try to signout act_name[' + req.session.act_name + '].');
  req.session.destroy(function(err) {
    if (err)
      logger.error(err);
  });
  res.redirect('/login');
};
