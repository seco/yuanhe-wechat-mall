/**
 * Merchant order event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var db = require('../../../../app').get('db');
var dbProxy = require('../../../../app').get('dbProxy');
var merchant = require('../../merchant');
var utils = require('../../../util/utils');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'merchant_order';

/**
 * message handler
 *
 * @public
 */
MsgHandler.prototype.handle = function(req, res, msg, cb) {
  if (!msgIsValid(msg)) {
    utils.invokeCallback(cb, new Error('invalid message'));
    return;
  }

  // Fetch order info from weixin and insert it into database.
  createOrder(order_id, function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    var order_id = result;

    // Get the newest member event in the past 30 days
    getMemberEvent(openid, function(err, event) {
      if (err) {
        utils.invokeCallback(cb, err);
        return;
      }

      var sales_store_id, member_store_id;

      if (event) {
        var sales_store_id = event.store_id;

        // get member by openid
        getMemberByOpenId(openid, function(err, member) {
          if (member.following_store_id) {
            member_store_id = member.following_store_id;
          } else {
            member_store_id = sales_store_id;
          }

          // update order info
          updateOrderInfo(order_id, sales_store_id, member_store_id, function(err, result) {
            if (err) {
              utils.invokeCallback(cb, err);
              return;
            }
            utils.invokeCallback(cb, null);
          });
        });
      } else {

      }
    });
  });
};

/**
 * Fetch order info from weixin and insert it into database.
 *
 * @param {String} order_id
 *
 * @private
 */
var createOrder = function(order_id, cb) {
  async.auto({
    order_info: function(cb) {
      merchant.getOrderInfoById(order_id, cb);
    },
    collection: function(cb) {
      dbProxy.collection("orders", cb);
    },
    create_order: ['order_info', 'collection', function(cb, results) {
      var info = results.order_info;
      var collection = results.collection;

      collection.insert({ "weixin_order_info": order_info }, cb);
    }],
  }, function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, result);
  });
};

/**
 * Get the newest member event in the past 30 days
 *
 * @param {String} openid
 *
 * @private
 */
var getMemberEvent = function(openid, cb) {
  async.waterfall([
    function(cb) {
      dbProxy.collection("member_events", cb);
    },
    function(collection, cb) {
      collection.find(
        { "openid": openid },
        { "limit": 1, "sort": { "time_created": -1 } },
        cb
      );
    }
  ], function(err, event) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    if (event) {
      var time_created = event.time_created;
      if (time_created) {
        utils.invokeCallback(cb, null, event);
        return;
      }
    }
    utils.invokeCallback(cb, null, null);
  });
};

/**
 * Check whether a message is valid
 *
 * @private
 *
 * @return {Boolean}
 */
var msgIsValid = function(msg) {
  return false;
};

/**
 * Initialize a new merchant order event message handler
 */
module.exports = function() {
  return new MsgHandler();
};
