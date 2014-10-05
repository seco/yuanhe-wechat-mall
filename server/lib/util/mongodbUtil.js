/**
 * Mongodb Util
 * Use bae's mongodb code sample as a reference.
 *
 * @author Bobby Tang, Minix Li
 *
 * @see http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/mongodb
 */

var mm = require('methodmissing');
var mongoClient = require('mongodb').MongoClient;
var path = require('path');
var logger = require('./log').getLogger(__filename);
var utils = require('./utils');

// default options
var defaultOpts = {
  db: {
    native_parser: false
  },
  server: {
    poolSize: 5,
    socketOptions: { connectTimeoutMS: 500 },
    auto_reconnect: true
  },
  replSet: {},
  mongos: {}
};

/**
 * MongoDBUtil initializer
 *
 * @param {String} url mongodburl
 * @param {String} username
 * @param {String} password
 */
var MongoDBUtil = function(url, username, password) {
  this.url = url;
  this.username = username;
  this.password = password;
  this.defaultOpts = defaultOpts;
};

/**
 * Establish connection pool
 *
 * @param {Function} cb
 *
 * @public
 */
MongoDBUtil.prototype.establishConnPool = function(cb) {
  var self = this;
  mongoClient.connect(self.url, self.defaultOpts, function(err, db) {
    if (err) {
      logger.error(err);
      utils.invokeCallback(cb, err);
      return;
    }

    db.authenticate(self.username, self.password, function(err, result) {
      if (err) {
        db.close();
        logger.error(err);
        utils.invokeCallback(cb, err);
        return;
      }

      self.db = db;
      self.dbProxy = getDBProxy.apply(self);

      utils.invokeCallback(cb, null, {
        "db": self.db,
        "dbProxy": self.dbProxy
      });
    });
  });
};

/**
 * Get db proxy
 *
 * @private
 *
 * @return {Object}
 */
var getDBProxy = function() {
  var config = { "url": this.url, "username": this.username, "password": this.password };
  var db = this.db;

  return mm(null, function(method, args) {
    args = Array.prototype.slice.call(args, 0);
    var cb = args.pop();

    args.push(function(err) {
      if (null == err) {
        cb.apply(null, Array.prototype.slice.call(arguments, 0));
        return;
      }
      retryWithNewConnection.call(null, config, method, args, cb);
    });

    db[method].apply(db, args);
    args.pop();
  });
};

/**
 * Retry with new connection
 *
 * @param {Object} config
 * @param {Function} method
 * @param {Array} args
 * @param {Function} cb
 *
 * @private
 */
var retryWithNewConnection = function(config, method, args, cb) {
  mongoClient.connect(config.url, {}, function(err, db) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    db.authenticate(config.username, config.password, function(err, result) {
      if (err) {
        db.close();
        utils.invokeCallback(cb, err);
        return;
      }
      args.push(function() {
        cb.apply(null, Array.prototype.slice.call(arguments, 0));
      });
      db[method].apply(db, args);
    });
  });
};

/**
 * Create and init mongodb util
 */
module.exports.create = function(url, username, password) {
  return new MongoDBUtil(url, username, password);
};
