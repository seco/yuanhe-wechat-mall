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

// generate local variables dynamically
var config = require('../../config');
for (var key in config) {
  eval("var " + key + " = '" + config[key] + "'");
};

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

var exp = module.exports;

// Connect Mongodb server
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
    exp.db = db;
    exp.dbProxy = getDBProxy(db);
  });
});

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

    var cb = args[args.length - 1];
    var cbProxy = function(err) {
      if (err) {
        mongoClient.connect(mongodburl, function(err, db) {
          db.authenticate(username, password, function(err, result) {
            db[method].apply(null, args);
          });
        });
        return;
      }

      cb.apply(null, Array.prototype.slice.call(arguments, 0));
    };

    var argsProxy = args.slice(0, args.length - 1);
    argsProxy.push(cbProxy);

    db[method].apply(null, argsProxy);
  });
}
