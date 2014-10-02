/**
 * Scan event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var db = require('../../../../app').get('db');
var dbProxy = require('../../../../app').get('dbProxy');
var utils = require('../../../util/utils');

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

  async.waterfall([
    function() {
      dbProxy.collection("stores", cb);
    },
    function(collection, cb) {
      collection.findOne(
        { "scene_id": scene_id }, cb
      )
    }
  ], function(err, store) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    async.waterfall([
      function(cb) {
        dbProxy.collection("members", cb);
      },
      function(collection, cb) {
        collection.update(
          { "openid": openid },
          { "$set": {
            "following_store_id": store._id,
            "time_following": new Date()
          } }, cb
        );
      }
    ], function(err, result) {
      if (err) {
        utils.invokeCallback(cb, err);
        return;
      }
      uitls.invokeCallback(cb, null);
    });
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
