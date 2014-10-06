/**
 * Brand handlers
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var utils = require(appPath + '/../lib/util/utils');

/**
 * Brand index handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.index = function(req, res) {
  res.end();
};

/**
 * Brand show handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.show = function(req, res) {
  res.end();
};

/**
 * Brand promotion handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.promotion = function(req, res) {
  res.end();
};
