/**
 * Dispatcher
 *
 * @author Minix Li
 */

/**
 * Route the message to appropriate handler
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} msg
 * @param {Object} handlers
 * @param {Function} cb
 *
 * @private
 */
module.exports.route = function(req, res, msg, handlers, cb) {
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

  handlers[namespace][handler].handle.call(null, req, res, msg, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
  });
};
