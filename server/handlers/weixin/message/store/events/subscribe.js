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
var YuanheGlobalCounter = require(appPath + '/../models/YuanheGlobalCounter');
var YuanheStore = require(appPath + '/../models/yuanheStore');

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

    endA: ['decisionA', true, function(cb, context) {
      endAHandler(cb, context);
    }],

    endB: ['decisionA', false, function(cb, context) {
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

  YuanheStore.getByOpenid(openid, function(err, store) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (store) { cond = true; }
    handlerCtx = { 'store': store };

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
  var store = context.store;

  async.waterfall([
    function(cb) {
      store.set('status', 'following');
      store.set('time_following', new Date());
      store.save(cb);
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
  var openid = context.openid;

  async.waterfall([
    function(cb) {
      YuanheGlobalCounter.yieldSceneId(cb);
    },
    function(sceneId, cb) {
      var store = new YuanheStore();
      store.set('openid', openid);
      store.set('scene_id', sceneId);
      store.set('status', 'following');
      store.set('time_following', new Date());
      store.save(cb);
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
