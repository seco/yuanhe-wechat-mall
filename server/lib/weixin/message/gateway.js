/**
 * weixin message gateway
 *
 * @author Minix Li
 */

var xml2js = require('xml2js');
var dispatcher = require('./dispatcher');
var utils = require('../../util/utils');

/**
 * Gateway initializer
 */
var Gateway = function() {
  /**
   * Load all types of message handlers
   */
  this.msgHandlers = {
    "common": {
      "text": require('./common/text'),
      "image": require('./common/image'),
      "voice": require('./common/voice'),
      "video": require('./common/video'),
      "location": require('./common/location'),
      "link": require('./common/link')
    },
    "events": {
      "subscribe": require('./events/subscribe'),
      "unsubscribe": require('./events/unsubscribe'),
      "scan": require('./events/scan'),
      "location": require('./events/location'),
      "click": require('./events/click'),
      "view": require('./events/view')
    }
  };
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} cb
 *
 * @public
 */
Gateway.prototype.dispatch = function(req, res, cb) {
  console.log(req.rawBody);
};

/**
 * Create and init gateway
 */
module.exports.create = function() {
  return new Gateway();
}
