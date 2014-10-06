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

  var openid = msg['xml']['FromUserName'];

  decisiontree.auto({
    // put openid into context and start decision A
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, { 'openid': openid });
    },
    // check whether exists a store with the openid
    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],
    // then update the store's status
    endA: ['decisionA', true, function(cb, context) {
      endAHandler(cb, context);
    }],
    // or save a new store
    endB: ['decisionA', false, function(cb, context) {
      endBHandler(cb, context);
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
 * Check whether exists a store with the given openid
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

  YuanheStore.getByOpenid(openid, function(err, storeEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (storeEntity.exists()) { cond = true; }
    handlerCtx.toreEntity = storeEntity;

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Update the store's status
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endAHandler = function(callback, context) {
  var storeEntity = context.storeEntity;

  async.waterfall([
    function(cb) {
      storeEntity.setFollowing();
      storeEntity.save(cb);
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
 * Save a new store
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endBHandler = function(callback, context) {
  var openid = context.openid;
  var storeEntity = context.storeEntity;

  async.waterfall([
    function(cb) {
      YuanheGlobalCounter.yieldSceneId(cb);
    },
    function(sceneId, cb) {
      storeEntity.setOpenid(openid);
      storeEntity.setScendId(sceneId);
      storeEntity.setFollowing();
      storeEntity.save(cb);
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
