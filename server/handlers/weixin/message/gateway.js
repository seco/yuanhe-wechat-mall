/**
 * weixin message gateway
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var parseString = require('xml2js').parseString;
var dispatcher = require('./dispatcher');
var loader = require(appPath + '/../lib/util/loader');
var utils = require(appPath + '/../lib/util/utils');

/**
 * Access weixin interface
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.access = function(req, res) {
  res.send(req.query.echostr);
};

/**
 * Message receiver
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.receive = function(req, res) {
  if (req.route == '/weixin/message/mall') {
    var msgHandlers = mallMsgHandlers;
  } else if (req.route == '/weixin/message/store') {
    var msgHandlers = mallMsgHandlers;
  }

  dispatch(req, res, msgHandlers, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.status(200).end();
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

// Mall message handlers
var mallMsgHandlers = loadMsgHandlers([
  { 'namespace': 'common', 'path': __dirname + '/mall/common' },
  { 'namespace': 'events', 'path': __dirname + '/mall/events' }
]);

// Store message handlers
var storeMsgHandlers = loadMsgHandlers([
  { 'namespace': 'common', 'path': __dirname + '/store/common' },
  { 'namespace': 'events', 'path': __dirname + '/store/events' }
]);

/**
 * Dispatch message to corresponding handler
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} msgHandlers
 * @param {Function} cb
 *
 * @public
 */
var dispatch = function(req, res, msgHandlers, cb) {
  parseString(req.rawBody, { explicitArray: false }, function(err, msgParsed) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    dispatcher.route(req, res, msgParsed, msgHandlers, function(err) {
      if(err) {
        utils.invokeCallback(cb, err);
        return;
      }
      utils.invokeCallback(cb, null);
    });
  });
};
