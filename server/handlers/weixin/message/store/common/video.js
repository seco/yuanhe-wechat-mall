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
 * message handler
 *
 * @public
 */
MsgHandler.prototype.handle = function(req, res, msg, cb) {
  if (!msgIsValid(msg)) {
    utils.invokeCallback(cb, new Error('invalid message'));
  }
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
 * Initialize a new video message handler
 */
module.exports = function() {
  return new MsgHandler();
};
