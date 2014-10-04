/**
 * weixin common util
 *
 * @author Minix Li
 * @see http://mp.weixin.qq.com/wiki/index.php?title=获取access_token
 */

var request = require('request');
var app = require('../../app');
var utils = require('../util/utils');

var accessToken = '';

var tokenGotAt = null;
var tokenExpiresIn = 7200 * 1000;

var exp = module.exports;

/**
 * Get access token by appid and secret
 *
 * @param {Function} cb
 *
 * @public
 */
exp.getAccessToken = function(cb) {
  if (tokenGotAt && !checkTokenExpired()) {
    utils.invokeCallback(cb, null, accessToken);
    return;
  }

  var config = app.get('yuanhe_config');

  var appid = config.appid;
  var secret = config.secret;

  request({
    url: composeGetAccessTokenUrl(appid, secret),
    method: 'GET'
  }, function(err, resp, body) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    try {
      data = JSON.parse(body);
    } catch(e) {
      utils.invokeCallback(cb, err);
      return;
    }
    if (data.errcode) {
      utils.invokeCallback(cb, new Error(data.errmsg));
      return;
    }

    accessToken = data.access_token;
    tokenGotAt = Date.now();

    utils.invokeCallback(cb, null, accessToken);
  });
};

/**
 * Check whether access token has expired
 *
 * @private
 *
 * @return {Boolean}
 */
var checkTokenExpired = function() {
  if ((Date.now() - tokenGotAt) < ((tokenExpiresIn / 3) * 2)) {
    return false;
  }
  return true;
};

/**
 * Compose request url to get access token
 *
 * @param {String} appid
 * @param {String} secret
 *
 * @private
 *
 * @return {String}
 */
var composeGetAccessTokenUrl = function(appid, secret) {
  return 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='
    + appid + '&secret=' + secret;
};
