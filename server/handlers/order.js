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
  var calendarKey = req.query.calendarKey;
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;

  var filter = {};

  if (searchKey && searchVal) {
    var regexp = new RegExp(searchVal);
    //filter['$or'] = [{'sales_store.store_name': regexp}, {'member_store.store_name': regexp}];
    filter[searchKey] = regexp;
  };

  if (calendarKey && startDate && endDate) {
    var toDate = new Date();
    toDate.setDate(new Date(endDate).getDate() + 1);
    filter[calendarKey] = {
      $gte: new Date(startDate),
      $lt: toDate
    };
  };

  logger.info('recevie backgrid request, set filter[' + JSON.stringify(filter) + '], limit[' + limit + '],skip[' + skip + ']');

  dbProxy.collection('orders', function(err, col) {
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
