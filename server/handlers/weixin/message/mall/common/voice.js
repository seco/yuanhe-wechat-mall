/**
 * Voice message handler
 *
 * @author Minix Li
 */

var utils = require('../../../../../lib/util/utils');

var MsgHandler = function() {};

MsgHandler.prototype.name = 'voice';

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
 * Initialize a new voice message handler
 */
module.exports = function() {
  return new MsgHandler();
};
