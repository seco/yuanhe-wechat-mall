/**
 * weixin OAuth handler
 *
 * @author Minix Li
 */

var oauth = require('../../lib/weixin/oauth');
var utils = require('../../lib/util/utils');

/**
 * OAuth response handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.response = function(req, res) {
  var code = req.query.code;

  oauth.getUserInfo(req, function(err, userInfo) {
    console.log(userInfo);
  });
};
