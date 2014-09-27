/**
 * This is order action handler module.
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
  var filter = {};

  if (searchKey && searchVal) {
    filter[searchKey] = new RegExp(searchVal);
  };

  logger.info('recevie backgrid request, set filter[' + JSON.stringify(filter) + '], limit[' + limit + '],skip[' + skip + ']');

  dbProxy.collection('orders', function(err, col) {
    col.count(filter, function(err, count) {
      content.total_count = count;
      col.find(filter, {
        limit: limit,
        skip: skip,
        sort: {
          created_at: -1
        }
      }).toArray(function(err, result) {
        content.items = result;

        res.json(content);
      });
    });
  });

};
