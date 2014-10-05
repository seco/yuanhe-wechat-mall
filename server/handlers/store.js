/**
 * This is store action handler class.
 *
 * @author Bobby Tang
 */

var app = require('../app');
var db = app.get('db');
var dbProxy = app.get('dbProxy');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../lib/util/log').getLogger(__filename);

exports.index = function(req, res, next) {
  var content = {};
  var limit = req.query.per_page;
  var skip = (req.query.page - 1) * req.query.per_page;
  var searchKey = req.query.searchKey;
  var searchVal = req.query.searchVal;
  var filter = {
    unfollow: false
  };

  if (searchKey && searchVal) {
    filter[searchKey] = new RegExp(searchVal);
  };

  logger.info('recevie backgrid request, set filter[' + JSON.stringify(filter) + '], limit[' + limit + '],skip[' + skip + ']');

  dbProxy.collection('stores', function(err, col) {
    if (err) {
      logger.error(err);
    }
    col.count(filter, function(err, count) {
      if (err) {
        logger.error(err);
      }
      content.total_count = count;
      col.find(filter, {
        limit: limit,
        skip: skip,
        sort: {
          created_at: -1
        }
      }).toArray(function(err, result) {
        if (err) {
          logger.error(err);
        }
        content.items = result;

        res.json(content);
      });
    });
  });

};

exports.show = function(req, res, next) {
  var content = {};
  var id = req.params.id || '';

  logger.info(id);

  dbProxy.collection('stores', function(err, col) {
    if (err) {
      logger.error(err);
    }
    col.findOne({
      _id: new ObjectID(id)
    }, function(err, doc) {
      if (err) {
        logger.error(err);
      }
      content = doc;
      res.json(content);
    });
  });

};
exports.edit = function(req, res, next) {

};
exports.new = function(req, res, next) {

};
exports.create = function(req, res, next) {

};
exports.update = function(req, res, next) {
  var content = {};
  var id = req.params.id || '';
  var updAttr = req.body;
  delete updAttr._id;

  dbProxy.collection('stores', function(err, col) {
    if (err) {
      logger.error(err);
    }
    col.update({
      _id: new ObjectID(id)
    }, {
      $set: updAttr
    }, function(err, result) {
      if (err) {
        logger.error(err);
      }
      logger.info('db.stores store[id=' + id + '] has been updated, updated row number = ' + result);
      dbProxy.collection('orders', function(err, col) {
        if (err) {
          logger.error(err);
        }
        col.update({
          'stores.id': new ObjectID(id)
        }, {
          $set: {
            'stores.$.store_name': updAttr.store_name
          }
        }, {
          multi: true
        }, function(err, result) {
          if (err) {
            logger.error(err);
          }
          logger.info('db.orders store[id=' + id + ', store_name=' + updAttr.store_name + '] name has been updated, updated row number = ' + result);

          res.json(result);
        });
      });
    });
  });

};
exports.destroy = function(req, res, next) {
  //console.dir(req.params);
  //res.send('');
};
