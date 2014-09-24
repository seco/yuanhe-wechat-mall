/**
 * weixin message gateway
 *
 * @author Minix Li
 */

var parseString = require('xml2js').parseString;
var dispatcher = require('./dispatcher');
var loader = require('../../util/loader');
var utils = require('../../util/utils');

/**
 * Gateway initializer
 */
var Gateway = function() {
  this.msgHandlers = loadMsgHandlers([
    { "namespace": "common", "path": __dirname + '/common' },
    { "namespace": "events", "path": __dirname + '/events' }
  ]);
  console.log(this.msgHandlers);
};

/**
 * Dispatch message to corresponding handler
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} cb
 *
 * @public
 */
Gateway.prototype.dispatch = function(req, res, cb) {
  parseString(req.rawBody, { explicitArray: false }, function(err, msgParsed) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    route(msgParsed, function(err) {
      if (err) {
        utils.invokeCallback(cb, err);
        return;
      }
    });
  });
};

/**
 * Load message handlers of all types
 *
 * @param {Array} items
 *
 * @private
 */
var loadMsgHandlers = function(items) {
  var result = {}, modules;

  for (var i = 0, l = items.length; i < l; i++) {
    item = items[i];

    if (modules = loader.load(item.path)) {
      createNamespace(item.namespace, result);

      for (var name in modules) {
        result[item.namespace][name] = modules[name];
      }
    }
  }

  return result;
};

/**
 * Create namespace
 *
 * @param {String} namespace
 * @param {Object} result
 *
 * @private
 */
var createNamespace = function(namespace, result) {
  result[namespace] = result[namespace] || {};
};

/**
 * Route the message to appropriate handler
 *
 * @param {Object} msg
 * @param {Function} cb
 *
 * @private
 */
var route = function(msg, cb) {
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

  this.msgHandlers[namespace][handler].handler.call(null, msg, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
  });
};

/**
 * Create and init gateway
 */
module.exports.create = function() {
  return new Gateway();
};
