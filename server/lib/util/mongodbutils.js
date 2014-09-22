/**
 * This is a mongodb util class.
 * Use bae's mongodb code sample as a reference.
 *
 * @author Bobby Tang
 *
 * @see http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/mongodb
 */

var mongoClient = require('mongodb').MongoClient;
var config = require('../../config');
var path = require('path');
var logger = require('./log').getLogger(__filename);

var DB = module.exports = {};

// generate local variables dynamically
for (var key in config) {
  eval("var " + key + " = '" + config[key] + "'");
};

mongoClient.connect(mongodburl, {
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
}, function(err, db) {
  if (err) {
    logger.error(err);
    return;
  }
  db.authenticate(username, password, function(err, result) {
    if (err) {
      logger.error(err);
      db.close();
      return;
    };

    // exports DB
    DB = db;

    var test_tb = db.collection('test_tb');
    // testing sql
    test_tb.save({
      _id: 101,
      testkey: 'testvalue'
    }, {
      w: 1
    }, function(err, result) {
      if (err) {
        logger.error(err);
        db.close();
        return;
      }

      test_tb.findOne({
        _id: 101
      }, function(err, item) {
        logger.info(item);
      });

    });

  });
});
