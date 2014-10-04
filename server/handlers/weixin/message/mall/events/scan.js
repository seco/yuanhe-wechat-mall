/**
 * Scan event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../../../../../app').get('dbProxy');
var decisiontree = require('../../../../../lib/util/decisionTree');
var utils = require('../../../../../lib/util/utils');
var YuanheMember = require('../../../../../models/yuanheMember');
var YuanheStore = require('../../../../../models/yuanheStore');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'scan';

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

  var startCtx = {
    'openid': openid,
    'sceneId': scene_id
  };

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

    endB: ['decisionA', true, function(cb, context) {
      endBHandler(cb, context);
    }],
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
  var sceneId = context.sceneId;

  async.waterfall([
    function(cb) {
      YuanheStore.getBySceneId(sceneId, cb);
    },
    function(store, cb) {
      var member = new YuanheMember();
      member.set('openid', openid);
      member.set('status', 'following');
      member.set('following_store_id', store.get('_id'));
      member.set('time_following', new Date());
      member.save(cb);
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
 * End B handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endBHandler = function(callback, context) {
  var member = context.member;

  async.waterfall([
    function(cb) {
      YuanheStore.getBySceneId(sceneId, cb);
    },
    function(store, cb) {
      member.set('status', 'following');
      member.set('following_store_id', store.get('_id'));
      member.set('time_following', new Date());
      member.save(cb);
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
 * Initialize a new scan event message handler
 */
module.exports = function() {
  return new MsgHandler();
};
