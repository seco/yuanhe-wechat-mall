/**
 * Merchant order event message handler
 *
 *
 * ******************************* DECISION TREE *******************************
 *
 *
 *   start --- decision A --- decision C --- decision D --- decision E --- end
 *                 |              |              |              |
 *                 |              |              |              |
 *                 |              |              |              |
 *     end --- decision B        end            end            end
 *                 |
 *                 |
 *                 |
 *                end
 *
 *
 *   Decision A check whether a member has viewed the product promotion page
 *   in the past 30 days.
 *
 *   Decision B check whether a member has been marked a channel source.
 *
 *   Decision C check whether a member has been marked a channel source.
 *
 *   Decision D check whether a member has subscribed yuanhe in the past
 *   30 days.
 *
 *   Decision E check whether a member has viewed the product promotion page.
 *
 * *****************************************************************************
 *
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
    // fetch order info from weixin
    get_order: function(cb) {
      merchant.getOrderInfoById(order_id, cb);
    },

    // create and save new order
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

    // check whether the member event is in the
    // past 30 days
    check_event: ['get_event', function(cb, results) {
      var order = results.save_order;
      var event = results.get_event;

      // sink into the next decision layer
      if (checkEventPosted(event)) {
        decisionA(openid, order, event, cb);
      } else {
        decisionD(cb);
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
      YuanheMember.getByOpenid(openid, cb);
    },

    function(member, cb) {
      var sales_store_id = event.get('store_id');

      // assign sales_store_id to member_store_id if
      // the member hasn't
      var member_store_id = member.get('following_store_id')
      if (!member_store_id) {
        member_store_id = sales_store_id;
      }

      order.updateStores(sales_store_id, member_store_id, cb);
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
 * Decision C
 *
 * @private
 */
var decisionC = function() {

};

/**
 * Decision D
 *
 * @private
 */
var decisionD = function() {

};

/**
 * Decision E
 *
 * @private
 */
var decisionE = function() {

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
