/**
 * weixin message handler
 *
 * @author Minix Li
 */

var Gateway = require('../../lib/weixin/message/gateway');
var utils = require('../../lib/util/utils');

var gateway = Gateway.create();

/**
 * Access weixin interface
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.access = function(req, res) {
  res.send(req.query.echostr);
};

/**
 * Message receive handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.receive = function(req, res) {
  gateway.dispatch(req, res, function(err) {
    if (err) { logger.error(err); }
    res.end();
  });
};
