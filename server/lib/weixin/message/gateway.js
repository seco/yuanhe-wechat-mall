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
  this.msgHandlers = {
    '/wexin/message/mall': loadMsgHandlers([
      { 'namespace': 'common', 'path': __dirname + '/mall/common' },
      { 'namespace': 'events', 'path': __dirname + '/mall/events' }
    ]),
    '/weixin/message/store': loadMsgHandlers([
      { 'namespace': 'common', 'path': __dirname + '/store/common' },
      { 'namespace': 'events', 'path': __dirname + '/store/events' }
    ])
  };
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
  var self = this;
  parseString(req.rawBody, { explicitArray: false }, function(err, msgParsed) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    dispatcher.route(req, res, msgParsed, self.msgHandlers, function(err) {
      if(err) {
        utils.invokeCallback(cb, err);
        return;
      }
      utils.invokeCallback(cb, null);
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
 * Create and init gateway
 */
module.exports.create = function() {
  return new Gateway();
};
