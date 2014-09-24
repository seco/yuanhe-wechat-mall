/**
 * This is store action handler class.
 *
 * @author Bobby Tang
 */

var app = require('../app');
var db = app.get('db');
var dbProxy = app.get('dbProxy');
var logger = require('../lib/util/log').getLogger(__filename);

exports.index = function(req, res, next) {
  var content = {};
  var stores = db.collection('stores');

  stores.count(function(err, count) {
    content.total_count = count;
    stores.find({
      unfollow: false
    }, function(err, result) {
      content.items = result;

      logger.info(content);

    });
  });

  res.json(content);
};

exports.show = function(req, res, next) {
  res.json({
    _id: 10,
    storeName: 'this is a storeName',
    storeType: 'VirtualStore'
  });
};
exports.edit = function(req, res, next) {

};
exports.new = function(req, res, next) {

};
exports.create = function(req, res, next) {

};
exports.update = function(req, res, next) {
  console.dir(req.body);
  //res.send(req.body);
  res.json(req.body);
};
exports.destroy = function(req, res, next) {
  console.dir(req.params);
  res.send('');
};
