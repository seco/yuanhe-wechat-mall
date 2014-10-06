/**
 * This is settlement action handler module.
 *
 * @author Bobby Tang
 */

var app = require('../../app');
var db = app.get('db');
var dbProxy = app.get('dbProxy');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../lib/util/log').getLogger(__filename);

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
    //var regexp = new RegExp(searchVal);
    //filter['$or'] = [{'sales_store.store_name': regexp}, {'member_store.store_name': regexp}];
    //filter[searchKey] = regexp;
  };

  if (calendarKey && startDate && endDate) {
    var toDate = new Date(endDate);
    toDate.setDate(toDate.getDate() + 1);
    filter[calendarKey] = {
      $gte: new Date(startDate),
      $lt: toDate
    };
  };

  logger.info('recevie backgrid request, set filter[' + JSON.stringify(filter) + '], limit[' + limit + '],skip[' + skip + ']');

  dbProxy.collection('orders', function(err, col) {
    col.aggregate([{
      $match: filter
    }, {
      $unwind: "$stores"
    }, {
      $group: {
        _id: {
          store_id: "$stores.store_id",
          store_name: "$stores.store_name"
        },
        total_commission: {
          $sum: "$stores.commission"
        }
      }
    }, {
      $group: {
        _id: null,
        count: {
          $sum: 1
        }
      }
    }], function(err, result) {
      if (err) {
        logger.error(err);
      }

      content.total_count = result[0].count;

      logger.info('return ' + content.total_count + ' rows within the settlement date range');

      col.aggregate([{
        $match: filter
      }, {
        $unwind: "$stores"
      }, {
        $group: {
          _id: {
            store_id: "$stores.store_id",
            store_name: "$stores.store_name"
          },
          total_commission: {
            $sum: "$stores.commission"
          }
        }
      }, {
        $sort: {
          "_id.store_id": 1
        }
      }, {
        $skip: skip
      }, {
        $limit: parseInt(limit)
      }], function(err, result) {
        if (err) {
          logger.error(err);
        }
        content.items = [];

        result.forEach(function(i){
          var item = {};
          //fix the issue while duplicate store_id, only display one
          //item._id = i._id.store_id;
          item.store_name = i._id.store_name;
          item.commission = i.total_commission;
          content.items.push(item);
        });

        res.json(content);
      });
    });

  });

};
