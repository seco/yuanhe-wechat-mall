/**
 * oauth handlers
 */

var oauthUtil = require('../util/oauthUtil');
var utils = require('../util/utils');

/**
 * response handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.response = function(req, res) {
  var code = req.query.code;

  oauthUtil.getUserInfo(req, function(err, resp, body) {
    console.log(body);
  });
};
