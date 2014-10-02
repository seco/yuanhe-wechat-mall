/**
 * Subscribe event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var db = require('../../../../app').get('db');
var dbProxy = require('../../../../app').get('dbProxy');
var decisiontree = require('../../../util/decisionTree');
var utils = require('../../../util/utils');
var YuanheMember = require('../../../../classes/yuanheMember');

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

  var startCtx = { 'openid': openid };
  decisiontree.auto({
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, startCtx);
    },

    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],

    endA: ['decisionA', false, function(cb, context) {
      endAHandler(cb, context);
    }],

    decisionB: ['decisionA', true, function(cb, context) {
      decisionBHandler(cb, context);
    }],

    endB: ['decisionB', true, function(cb, context) {
      utils.invokeCallback(cb, null);
    }],

    decisionC: ['decisionB', false, function(cb, context) {
      decisionCHandler(cb, context);
    }],

    endC: ['decisionC', false, function(cb, context) {
      utils.invokeCallback(cb, null);
    }],

    endD: ['decisionC', true, function(cb, context) {
      endDHandler(cb, context);
    }]
  }, function(err, context) {

  });
};

/**
 * Decision A handler
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

  YuanheMember.getByOpenid(openid, function(err, member) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (member) { cond = true; }
    handlerCtx = { 'member': member };

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * End A handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endAHandler = function(callback, context) {
  var openid = context.openid;

  var member = new YuanheMember();
  member.set('openid', openid);
  member.set('status', 'following');
  member.set('time_following', new Date());

  member.save(function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * Decision B handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionBHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var member = context.member;

  async.waterfall([
    function(cb) {
      member.set('status', 'following');
      member.set('time_following', new Date());
      member.save(cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (!member.get('following_store_id')) { cond = false; }
    utils.invokeCallback(callback, null, cond, handlerCtx);
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

  var openid = context.openid;
  var member = context.member;

  async.waterfall([
    function(cb) {
      YuanheMemberEvent.getLastByOpts({
        'openid': openid,
        'type': 'view'
      }, cb);
    }
  ], function(err, memberEvent) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    // TODO
    if (false) { cond = true; }
    handlerCtx.memberEvent = memberEvent;

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
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
  var member = context.member;
  var memberEvent = context.memberEvent;

  async.waterfall([
    function(cb) {
      member.updateFollowingStoreId(
        memberEvent.get('store_id'), cb
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
