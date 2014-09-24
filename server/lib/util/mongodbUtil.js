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

var DB = function() {
  if (!(this instanceof DB)) {
    return new DB();
  }

  // Mongodb options
  var mongodbopts = {
    db: {
      native_parser: false
    },
    server: {
      poolSize: 5,
      socketOptions: {
        connectTimeoutMS: 500
      },
      auto_reconnect: true
    },
    replSet: {},
    mongos: {}
  };
  // generate local variables dynamically
  var config = require('../../config');
  for (var key in config) {
    eval("var " + key + " = '" + config[key] + "'");
  };

  initDB.call(this, mongodburl, username, password, mongodbopts);

};

module.exports = DB;

DB.prototype.getConn = function() {
  return this.conn;
};


// Connect Mongodb server
var initDB = function(mongodburl, username, password, mongodbopts) {
  mongoClient.connect(mongodburl, mongodbopts, function(err, db) {
    if (err) {
      logger.error(err);
      return;
    }
    db.authenticate(username, password, function(err, result) {
      if (err) {
        logger.error(err);
        db.close();
        return;
      }

      logger.info(db);

      this.conn = db;
      this.proxyConn = getDBProxy(db);
    });
  });
};
/**
 * Get db proxy
 *
 * @param {Object} db
 *
 * @private
 *
 * @return {Object}
 */
var getDBProxy = function(db) {
  return mm(null, function(method, args) {
    args = Array.prototype.slice.call(args, 0);

    var cb = args.pop();
    args.push(function(err) {
      if (null == err) {
        cb.apply(null, Array.prototype.slice.call(arguments, 0));
        return;
      }
      retryWithNewConnection(method, args, cb);
    });

    db[method].apply(db, args);
    args.pop();
  });
};

/**
 * Retry with new connection
 *
 * @param {Function} method
 * @param {Array} args
 * @param {Function} cb
 *
 * @private
 */
var retryWithNewConnection = function(method, args, cb) {
  mongoClient.connect(mongodburl, function(err, db) {
    if (err) {
      db.close();
      utils.invokeCallback(cb, err);
      return;
    }

    db.authenticate(username, password, function(err, result) {
      if (err) {
        db.close();
        utils.invokeCallback(cb, err);
        return;
      }

      args.push(function() {
        db.close();
        cb.apply(null, Array.prototype.slice.call(arguments, 0));
      });

      db[method].apply(db, args);
    });
  });
};
