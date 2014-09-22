/**
 * weixin message handler
 *
 * @author Minix Li
 */

var utils = require('../../util/utils');

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
  console.log(req.body);
};
