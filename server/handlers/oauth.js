/**
 * oauth handlers
 */

var oauthUtil = require('../util/weixin/oauth');
var utils = require('../util/utils');

/**
 * response handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.response = function(req, res) {
  var code = req.query.code;

  oauthUtil.getUserInfo(req, function(err, userInfo) {
    console.log(userInfo);
  });
};
