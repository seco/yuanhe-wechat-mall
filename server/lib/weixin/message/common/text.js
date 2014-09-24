/**
 * Text message handler
 *
 * @author Minix Li
 */

module.exports = function() {
  return new MsgHandler();
};

var MsgHandler = function() {

};

MsgHandler.prototype.name = 'text';

/**
 *
 */
MsgHandler.prototype.handle = function(req, res, msg, cb) {
};
