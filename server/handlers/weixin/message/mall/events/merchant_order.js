/**
 * Merchant order event message handler
 *
 *
 * ***************************************** DECISION TREE *****************************************
 *
 *
 *     start ---------- decision A ---------- decision C ---------- decision D ---------- end F
 *                           |                     |                     |
 *                           |                     |                     |
 *                           |                     |                     |
 *     end A ---------- decision B               end C              decision E ---------- end D
 *                           |                                           |
 *                           |                                           |
 *                           |                                           |
 *                         end B                                       end E
 *
 *
 *   Decision A check whether a member has viewed the product promotion page in the past 30 days.
 *
 *   Decision B check whether this member exists and  has been marked a channel source.
 *
 *   Decision C check whether a client has been marked a channel source.
 *
 *   Decision D check whether a client has subscribed yuanhe in the past 30 days.
 *
 *   Decision E check whether a client has viewed the product promotion page in the past.
 *
 * *************************************************************************************************
 *
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var decisiontree = require(appPath + '/../lib/util/decisionTree');
var utils = require(appPath + '/../lib/util/utils');
var merchant = require(appPath + '/../lib/weixin/merchant');
var YuanheMember = require(appPath + '/../models/yuanheMember');
var YuanheMemberEvent = require(appPath + '/../models/yuanheMemberEvent');
var YuanheOrder = require(appPath + '/../models/yuanheOrder');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'merchant_order';

/**
 * Message handler
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

  var openid = msg['xml']['FromUserName'];
  var orderId = msg['xml']['OrderId'];
  var productId = msg['xml']['ProductId'];

  decisiontree.auto({
    // put openid into context and start decision A
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, {
        'orderId': orderId, 'productId': productId, 'openid': openid
      });
    },
    // check whether exists member view event in the past 30 days
    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],
    // Check whether this member exists and has been marked a
    // channel source.
    decisionB: ['decisionA', true, function(cb, context) {
      decisionBHandler(cb, context);
    }],
    // set this order's sales store and member store
    endA: ['decisionB', true, function(cb, context) {
      endAHandler(cb, context);
    }],
    // set this order's sales store and member store
    endB: ['decisionB', false, function(cb, context) {
      endBHandler(cb, context);
    }],

    decisionC: ['decisionA', false, function(cb, context) {
      decisionCHandler(cb, context);
    }],

    endC: ['decisionC', true, function(cb, context) {
      endCHandler(cb, context);
    }],

    decisionD: ['decisionC', false, function(cb, context) {
      decisionDHandler(cb, context);
    }],

    endD: ['decisionD', true, function(cb, context) {
      endDHandler(cb, context);
    }],

    decisionE: ['decisionD', false, function(cb, context) {
      decisionEHandler(cb, context);
    }],

    endE: ['decisionE', true, function(cb, context) {
      endEHandler(cb, context);
    }],

    endF: ['decisionE', false, function(cb, context) {
      endFHandler(cb, context);
    }]
  }, function(err, context) {
  });
};

/**
 * Check whether exists member view event in the past 30 days
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionAHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var orderId = context.orderId;
  var productId = context.productId;
  var openid = context.openid;

  async.waterfall([
    // get order info from weixin
    function(cb) {
      merchant.getOrderInfoById(orderId, cb);
    },
    // save new order
    function(orderInfo, cb) {
      var order = new YuanheOrder();

      // put order into context
      handlerCtx.order = order;

      order.set('weixin_order_id', orderId);
      order.set('weixin_order_info', orderInfo);
      order.save(cb);
    },
    // check member event
    function(result, cb) {
      YuanheMemberEvent.getLastByOpts({
        'member_openid': openid,
        'annotation_id': productId,
        'type': 'view'
      }, cb);
    }
  ], function(err, memberEvent) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEvent.exists()) {
      if (utils.checkInPastDays(memberEvent.get('posted'), 30)) { cond = true; }
    }
    handlerCtx.memberEvent = memberEvent;

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Check whether this member exists and has been marked a
 * channel source.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionBHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var openid = context.openid;

  async.waterfall([
    function(cb) {
      YuanheMember.getByOpenid(openid, cb);
    }
  ], function(err, member) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (member.exists()) {
      if (member.hasChannelStore()) { cond = true; }
    }
    handlerCtx = { 'member': member };

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Set this order's sales store and member store
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endAHandler = function(callback, context) {
  var order = context.order;

  var member = context.member;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      order.updateStores(
        memberEvent.getObjectId(),
        member.get('channel_store_id'), cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * Set this order's sales store and member store
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endBHandler = function(callback, context) {
  var order = context.order;

  var member = context.member;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      member.updateChannelStore(
        memberEvent.getObjectId(), cb
      );
    },
    function(result, cb) {
      order.updateStores(
        memberEvent.getObjectId(),
        memberEvent.getObjectId(), cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * Decision C handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionCHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var member = context.member;

  if (member.get('following_store_id')) { cond = true; }
  utils.invokeCallback(callback, null, cond, handlerCtx);
};

/**
 * End C handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endCHandler = function(callback, context) {
  var order = context.order;
  var member = context.member;

  async.waterfall([
    function(cb) {
      order.updateStores(
        // TODO
        member.get('following_store_id'), cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * Decision D handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionDHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var openid = context.openid;

  async.waterfall([
    function(cb) {
      YuanheMemberEvent.getLastByOpts({
        'openid': openid,
        'type': 'subscribe'
      }, cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    // TODO
    if (false) { cond = true; }
    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * End F handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endFHandler = function(callback, context) {
  var order = context.order;
  var member = context.member;

  async.waterfall([
    function(cb) {
      member.updateFollowingStoreId(
        // TODO
        cb
      );
    },
    function(result, cb) {
      order.updateStores(
        // TODO
        // TODO
        cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * Decision E handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionEHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  if (context.memberEvent) { cond = true; }
  utils.invokeCallback(callback, null, cond, handlerCtx);
};

/**
 * End D handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endDHandler = function(callback, context) {
  var order = context.order;
  var member = context.member;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      member.updateFollowingStoreId(
        memberEvent.get('store_id'), cb
      );
    },
    function(result, cb) {
      order.updateStores(
        memberEvent.get('store_id'),
        // TODO
        cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * End E handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endEHandler = function(callback, context) {
  var order = context.order;
  var member = context.member;

  async.waterfall([
    function(cb) {
      member.updateFollowingStoreId(
        // TODO
        cb
      );
    },
    function(result, cb) {
      order.updateStores(
        // TODO
        // TODO
        cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
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
  return true;
};

/**
 * Initialize a new merchant order event message handler
 */
module.exports = function() {
  return new MsgHandler();
};
