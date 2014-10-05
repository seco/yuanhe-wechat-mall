/**
 * Subscribe event message handler
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var decisiontree = require(appPath + '/../lib/util/decisionTree');
var utils = require(appPath + '/../lib/util/utils');
var YuanheMember = require(appPath + '/../models/yuanheMember');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'subscribe';

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

  decisiontree.auto({
    // put openid into context and start decision A
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, { 'openid': openid });
    },
    // check whether exists a member with the openid
    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],
    // check whether this member has been set a channel store id
    decisionB: ['decisionA', true, function(cb, context) {
      decisionBHandler(cb, context);
    }],
    // return if this member has been set a channel store id
    endA: ['decisionB', true, function(cb, context) {
      utils.invokeCallback(cb, null);
    }],
    // Check whether exists member view event in the past 30 days if
    // channel store id not set.
    decisionC: ['decisionB', false, function(cb, context) {
      decisionCHandler(cb, context);
    }],
    // return if member view event not exists
    endB: ['decisionC', false, function(cb, context) {
      utils.invokeCallback(cb, null);
    }],
    // update member's channel store id if member view event exists
    endC: ['decisionC', true, function(cb, context) {
      endCHandler(cb, context);
    }],
    // save new member
    decisionD: ['decisionA', false, function(cb, context) {
      decisionDHandler(cb, context);
    }],
    // Check whether exists member view event in the past 30 days if
    // channel store id not set.
    decisionE: ['decisionD', true, function(cb, context) {
      decisionEHandler(cb, context);
    }],
    // return if member view event not exists
    endD: ['decisionE', false, function(cb, context) {
      utils.invokeCallback(cb, null);
    }],
    // update member's channel store id if member view event exists
    endE: ['decisionE', true, function(cb, context) {
      endEHandler(cb, context);
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
 * Check whether exists a member with the openid
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

  YuanheMember.getByOpenid(openid, function(err, memberEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEntity.exists()) { cond = true; }
    handlerCtx = { 'memberEntity': memberEntity };

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Check whether this member has been set a channel store id
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionBHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var memberEntity = context.memberEntity;

  async.waterfall([
    function(cb) {
      memberEntity.setFollowing();
      memberEntity.save(cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEntity.hasChannelStore()) {
      cond = true;
    }

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Check whether exists member view event in the past 30 days if
 * channel store id not set.
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
      YuanheMemberEvent.getLastViewEvent(openid, cb);
    }
  ], function(err, memberEvent) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEvent.exists()) {
      if (utils.checkInPastDays(memberEvent.getPosted(), 30)) { cond = true; }
    }
    handlerCtx = { 'memberEvent': memberEvent };

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Update member's channel store if member view event
 * exists.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endCHandler = function(callback, context) {
  var memberEntity = context.memberEntity;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      memberEntity.setChannelStore(
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
 * Save new member
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionDHandler = function(callback, context) {
  var cond = true;
  var handlerCtx = {};

  var openid = context.openid;
  var memberEntity = context.memberEntity;

  async.waterfall([
    function(cb) {
      memberEntity.setOpenid(openid);
      memberEntity.setFollowing();
      memberEntity.save(cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Check whether exists member view event in the past 30 days if
 * channel store id not set.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionEHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var openid = context.openid;

  async.waterfall([
    function(cb) {
      YuanheMemberEvent.getLastViewEvent(openid, cb);
    }
  ], function(err, memberEvent) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (memberEvent.exists()) {
      if (utils.checkInPastDays(memberEvent.getPosted(), 30)) { cond = true; }
    }
    handlerCtx = { 'memberEvent': memberEvent };

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Update member's channel store if member view event
 * exists.
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endEHandler = function(callback, context) {
  var memberEntity = context.memberEntity;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      memberEntity.setChannelStore(
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
 * Initialize a new subscribe event message handler
 */
module.exports = function() {
  return new MsgHandler();
};
