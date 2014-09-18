/**
 * oauth handler
 */

var oauthUtil = require('../util/oauthUtil');

exports.response = function(req, res) {
  var code = req.query.code;

  oauthUtil.getAccessToken(code, function(err, resp, body) {
    console.log(body);
  });
}
