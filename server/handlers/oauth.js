/**
 * oauth handler
 */

var oauthUtil = require('../util/oauthUtil');
var utils = require('../util/utils');

exports.response = function(req, res) {
  var code = req.query.code;

  oauthUtil.getUserInfo(req, function(err, resp, body) {
    console.log(body);
  });
};
