/**
 * Product handler
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var utils = require(appPath + '/../lib/util/utils');

/**
 * @param {Object} req
 * @param {Object} res
 */
exports.show = function(req, res) {

};
