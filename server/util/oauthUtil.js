/*
 * oauthUtil
 */

var request = require('request');
var utils = require('./utils');

module.exports.getAccessToken = getAccessToken;

function getAccessToken(app, code, cb) {
  var settings = app.get('yuanhe_config');
  var appid = settings.appid;
  var secret = settings.secret;

  request({
    url: composeGetAccessTokenUrl(appid, secret, code),
    method: 'GET'
  }, function(err, resp, body) {
    utils.invokeCallback(cb, err, resp, body);
  });
}

function composeGetAccessTokenUrl(appid, secret, code) {
  return 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='
    + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code';
}
