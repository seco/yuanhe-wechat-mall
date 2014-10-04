/**
 * Video message handler
 *
 * @author Minix Li
 */

var appPath = process.argv[1];
var utils = require(appPath + '/../lib/util/utils');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'video';

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
  }
  utils.invokeCallback(cb, null);
};

/**
 * Check whether a message is valid
 *
 * @param {Object} msg
 *
 * @private
 *
 * @return {Boolean}
 */
var msgIsValid = function(msg) {
  return true;
};

// export a new video message handler
module.exports = function() {
  return new MsgHandler();
};
