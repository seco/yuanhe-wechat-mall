/**
 * Merchant order event message handler
 *
 *
 * ***************************************** DECISION TREE *****************************************
 *
 *
 *     start ---------- decision A ---------- decision C ---------- decision D ---------- end D
 *                           |                     |                     |
 *                           |                     |                     |
 *                           |                     |                     |
 *     end A ---------- decision B               end C              decision E ---------- end F
 *                           |                                           |
 *                           |                                           |
 *                           |                                           |
 *                         end B                                       end E
 *
 *
 *   Decision A check whether the member has viewed the product promotion page in the past 30 days.
 *
 *   Decision B check whether the member exists and has been marked a channel store.
 *
 *   Decision C check whether the member exists and has been marked a channel store.
 *
 *   Decision D check whether the member has subscribed yuanhe mall in the past 30 days.
 *
 *   Decision E check whether the member has viewed the product promotion page in the past.
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

  // put openid, order id and product id into context
  var startCtx = { 'openid': openid, 'orderId': orderId, 'productId': productId };

  decisiontree.auto({
    // and then start decision A
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, startCtx);
    },
    // Check whether exists member view event in the past 30 days.
    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],
    // Check whether this member exists and has been marked a channel store.
    decisionB: ['decisionA', true, function(cb, context) {
      decisionBHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endA: ['decisionB', true, function(cb, context) {
      endAHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endB: ['decisionB', false, function(cb, context) {
      endBHandler(cb, context);
    }],
    // Check whether this member exists and has been marked a channel store.
    decisionC: ['decisionA', false, function(cb, context) {
      decisionCHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endC: ['decisionC', true, function(cb, context) {
      endCHandler(cb, context);
    }],
    // Check whether the member has subscribed yuanhe mall in the past 30 days.
    decisionD: ['decisionC', false, function(cb, context) {
      decisionDHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endD: ['decisionD', false, function(cb, context) {
      endDHandler(cb, context);
    }],
    // Check whether the member has viewed the product promotion page in the past.
    decisionE: ['decisionD', true, function(cb, context) {
      decisionEHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endE: ['decisionE', true, function(cb, context) {
      endEHandler(cb, context);
    }],
    // then set this order's sales store and member store
    endF: ['decisionE', false, function(cb, context) {
      endFHandler(cb, context);
    }]
  }, function(err, context) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Check whether exists member view event in the past 30 days.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionAHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var openid = context.openid;
  var orderId = context.orderId;
  var productId = context.productId;

  async.waterfall([
    // get order info from weixin
    function(cb) {
      merchant.getOrderInfoById(orderId, cb);
    },
    // and save a new order
    function(orderInfo, cb) {
      var orderEntity = new YuanheOrder();

      // put the new order entity into context
      handlerCtx.orderEntity = orderEntity;

      orderEntity.setWeixinOrderId(orderId);
      orderEntity.setWeixinOrderInfo(orderInfo);
      orderEntity.setMember(openid, orderInfo.buyer_nick);
      orderEntity.save(cb);
    },
    // and then check whether exists member view event
    function(result, cb) {
      YuanheMemberEvent.getLastViewEvent2(openid, productId, cb);
    }
  ], function(err, eventEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (eventEntity.exists()) {
      if (utils.checkInPastDays(eventEntity.createdTime(), 30)) {
        cond = true;
      }
    }
    handlerCtx.eventEntity = eventEntity;

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Check whether this member exists and has been marked a channel source.
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
  ], function(err, memberEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEntity.exists()) {
      if (memberEntity.hasChannelStore()) {
        cond = true;
      }
    }
    handlerCtx.memberEntity = memberEntity;

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
  var orderEntity = context.orderEntity;

  var memberEntity = context.memberEntity;
  var eventEntity = context.eventEntity;

  async.waterfall([
    function(cb) {
      orderEntity.setSalesStore(eventEntity.getStoreId());
      orderEntity.setChannelStore(memberEntity.getChannelStore());
      orderEntity.save(cb);
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
  var orderEntity = context.orderEntity;

  var memberEntity = context.memberEntity;
  var eventEntity = context.eventEntity;

  async.waterfall([
    function(cb) {
      if (!memberEntity.exists()) {
        memberEntity.setOpenid(context.openid);
      }
      memberEntity.setChannelStore(eventEntity.getStoreId());
      memberEntity.save(cb);
    },
    function(result, cb) {
      orderEntity.setBothStores(eventEntity.getStoreId());
      orderEntity.save(cb);
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
 * Check whether this member exists and has been marked a channel store.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionCHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var openid = context.openid;

  async.waterfall([
    function(cb) {
      YuanheMember.getByOpenid(openid, cb);
    }
  ], function(err, memberEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEntity.exists()) {
      if (memberEntity.hasChannelStore()) {
        cond = true;
      }
    }
    handlerCtx.memberEntity = memberEntity;

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
var endCHandler = function(callback, context) {
  var orderEntity = context.orderEntity;
  var memberEntity = context.memberEntity;

  async.waterfall([
    function(cb) {
      orderEntity.setSalesStore();
      orderEntity.setChannelStore(memberEntity.getChannelStore());
      orderEntity.save(cb);
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
 * Check whether the member has subscribed yuanhe mall in the past 30 days.
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
      YuanheMemberEvent.getLastSubscribeEvent(openid, cb);
    }
  ], function(err, eventEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (eventEntity.exists()) {
      if (utils.checkInPastDays(eventEntity.createdTime(), 30)) {
        cond = true;
      }
    }

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
var endDHandler = function(callback, context) {
  var orderEntity = context.orderEntity;
  var memberEntity = context.memberEntity;

  async.waterfall([
    function(cb) {
      if (!memberEntity.exists()) {
        memberEntity.setOpenid(context.openid);
      }
      memberEntity.setChannelStore();
      memberEntity.save(cb);
    },
    function(result, cb) {
      orderEntity.setBothStores();
      orderEntity.save(cb);
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
 * Check whether the member has viewed the product promotion page
 * in the past.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionEHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var eventEntity = context.eventEntity;
  if (eventEntity.exists()) {
     cond = true;
  }

  utils.invokeCallback(callback, null, cond, handlerCtx);
};

/**
 * Set this order's sales store and member store
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endEHandler = function(callback, context) {
  var orderEntity = context.orderEntity;

  var memberEntity = context.memberEntity;
  var eventEntity = context.eventEntity;

  async.waterfall([
    function(cb) {
      memberEntity.setChannelStore(eventEntity.getStoreId());
      memberEntity.save(cb);
    },
    function(result, cb) {
      orderEntity.setSalesStore(eventEntity.getStoreId());
      orderEntity.setChannelStore();
      orderEntity.save(cb);
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
var endFHandler = function(callback, context) {
  var orderEntity = context.orderEntity;
  var memberEntity = context.memberEntity;

  async.waterfall([
    function(cb) {
      memberEntity.setChannelStore();
      memberEntity.save(cb);
    },
    function(result, cb) {
      orderEntity.setBothStores();
      orderEntity.save();
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
