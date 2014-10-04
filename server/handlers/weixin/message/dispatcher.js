/**
 * Message dispatcher
 *
 * @author Minix Li
 */

var utils = require('../../../lib/util/utils');

/**
 * Route the message to appropriate message handler
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} msg
 * @param {Object} msgHandlers
 * @param {Function} cb
 *
 * @private
 */
module.exports.route = function(req, res, msg, msgHandlers, cb) {
  var xml, msgType, event;

  if (!(xml = msg['xml']) || !(msgType = xml['MsgType'])) {
    utils.invokeCallback(cb, new Error('invalid message'));
    return;
  }
  if ((msgType == 'event') && !(event == xml['event'])) {
    utils.invokeCallback(cb, new Error('invalid message'));
    return;
  }

  var namespace = (msgType == 'event' ? 'event' : 'common');
  var handler = (msgType == 'event' ? event : msgType);

  msgHandlers[req.route][namespace][handler].handle.call(null, req, res, msg, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
  });
};
