/**
 * Subscribe event message handler
 *
 * @author Minix Li
 */

var async = require('async');
var db = require('../../../../app').get('db');
var dbProxy = require('../../../../app').get('dbProxy');
var utils = require('../../../util/utils');

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

  async.waterfall([
    function(cb) {
      dbProxy.collection("member_events", cb);
    },
    function(collection, cb) {
      collection.find(
        { "openid": openid },
        { "limit": 1, "sort": { "time_created": -1 } }, cb
      );
    }
  ], function(err, member_event) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    var time_created = member_event.time_created;

    async.waterfall([
      function(cb) {
        dbProxy.collection("members", cb);
      },
      function(collection, cb) {
        if (member_event && time_created) {
          collection.update(
            { "_id": member_event.member_id },
            { "$set": {
              "following_store_id": member_event.store_id,
              "time_following": new Date()
            } }, cb
          );
        } else {
          collection.update(
            { "_id": member_event.member_id },
            { "$set": { "following_store_id": null} }, cb
          );
        }
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
 * Initialize a new subscribe event message handler
 */
module.exports = function() {
  return new MsgHandler();
};
