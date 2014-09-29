/**
 * Merchant order event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../../../../app').get('dbProxy');
var merchant = require('../../merchant');
var utils = require('../../../util/utils');
var YuanheMember = require('../../../../classes/yuanheMember');
var YuanheMemberEvent = require('../../../../classes/yuanheMemberEvent');
var YuanheOrder = require('../../../../classes/yuanheOrder');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'merchant_order';

/**
 * message handler
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} msg
 * @param {Function} cb
 *
 * @public
 */
MsgHandler.prototype.handle = function(req, res, msg, cb) {
  if (!msgIsValid(msg)) {
    utils.invokeCallback(cb, new Error('invalid message'));
    return;
  }

  async.auto({
    // fetch order from weixin
    get_order: function(cb) {
      merchant.getOrderInfoById(order_id, cb);
    },
    // create and save order
    save_order: ['get_order', function(cb, results) {
      var order = new YuanheOrder();
      var order_info = results.get_order;

      order.set('weixin_order_id', order_id);
      order.set('weixin_order_info', order_info);

      order.save(cb);
    }],
    // get the last member event by openid
    get_event: ['save_order', function(cb, results) {
      YuanheMemberEvent.getLastByOpenid(openid, cb);
    }],
    // check whether the member event is in the past 30 days
    check_event: ['get_event', function(cb, results) {
      var order = results.save_order;
      var event = results.get_event;

      // sink into the next layer
      if (checkEventPosted(event)) {
        decisionA(openid, order, event, cb);
      } else {
        decisionB(cb);
      }
    }]
  }, function(err, results) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Decision A
 *
 * @param {String} openid
 * @param {YuanheOrder} order
 * @param {YuanheEvent} event
 * @param {Function} cb
 *
 * @private
 */
var decisionA = function(openid, order, event, cb) {
  async.waterfall([
    function(cb) {
      // get yuanhe member by openid
      YuanheMember.getByOpenid(openid, cb);
    },
    function(member, cb) {
      var sales_id = event.get('store_id');
      var member_id = member.get('following_store_id')
      // assign sales_id to member_id if the member didn't follow
      if (!member_id) {
        member_id = sales_id;
      }
      // update both sales and member stores
      order.updateStores(sales_id, member_id, cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Decision B
 *
 * @private
 */
var decisionB = function() {

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
