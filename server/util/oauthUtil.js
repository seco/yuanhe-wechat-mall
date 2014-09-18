/**
 * oauthUtil
 *
 * @see http://mp.weixin.qq.com/wiki/index.php?title=网页授权获取用户基本信息
 */

var request = require('request');
var app = require('../app');
var utils = require('./utils');

var oauthUtil = module.exports = {};

/**
 * Get access token by code
 *
 * @param {String} code
 * @param {Function} cb
 */
oauthUtil.getAccessToken = function(code, cb) {
  var config = app.get('yuanhe_config');
  var appid = config.appid;
  var secret = config.secret;

  request({
    url: composeGetAccessTokenUrl(appid, secret, code),
    method: 'GET'
  }, function(err, resp, body) {
    utils.invokeCallback(cb, err, resp, body);
  });
}

/**
 * Pull user info by access_token and openid
 *
 * @param {String} access_token
 * @param {String} openid
 */
oauthUtil.pullUserInfo = function(access_token, openid) {

}

/**
 * Compose request url to get access_token
 *
 * @param {String} appid
 * @param {String} secret
 * @param {String} code
 *
 * @return {String}
 */
var composeGetAccessTokenUrl = function(appid, secret, code) {
  return 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='
    + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code';
}

/**
 * Compose request url to pull user info
 *
 * @param {String} access_token
 * @param {String} openid
 * @param {String} lang
 *
 * @return {String}
 */
var composePullUserInfo = function(access_token, openid, lang) {

}
