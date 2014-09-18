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
 * Get user info
 *
 * @param {Object} req
 * @param {Function} cb
 *
 * @public
 */
oauthUtil.getUserInfo = function(req, cb) {
  var code = req.query.code;

  getAccessToken(code, function(err, resp, body) {
    body = JSON.parse(body);

    var access_token = body.access_token;
    var openid = body.openid;

    pullUserInfo(access_token, openid, function(err, resp, body) {
      utils.invokeCallback(cb, err, resp, body);
    });
  });
};

/**
 * Get access token by code
 *
 * @param {String} code
 * @param {Function} cb
 *
 * @private
 */
var getAccessToken = function(code, cb) {
  var config = app.get('yuanhe_config');
  var appid = config.appid;
  var secret = config.secret;

  request({
    url: composeGetAccessTokenUrl(appid, secret, code),
    method: 'GET'
  }, function(err, resp, body) {
    utils.invokeCallback(cb, err, resp, body);
  });
};

/**
 * Pull user info by access_token and openid
 *
 * @param {String} access_token
 * @param {String} openid
 * @param {Function} cb
 *
 * @private
 */
var pullUserInfo = function(access_token, openid, cb) {
  request({
    url: composePullUserInfoUrl(access_token, openid, 'zh_CN'),
    method: 'GET'
  }, function(err, resp, body) {
    utils.invokeCallback(cb, err, resp, body);
  });
};

/**
 * Compose request url to get access_token
 *
 * @param {String} appid
 * @param {String} secret
 * @param {String} code
 *
 * @private
 *
 * @return {String}
 */
var composeGetAccessTokenUrl = function(appid, secret, code) {
  return 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='
    + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code';
};

/**
 * Compose request url to pull user info
 *
 * @param {String} access_token
 * @param {String} openid
 * @param {String} lang
 *
 * @private
 *
 * @return {String}
 */
var composePullUserInfoUrl = function(access_token, openid, lang) {
  return 'https://api.weixin.qq.com/sns/userinfo?access_token='
    + access_token + '&openid=' + openid + '&lang=' + lang;
};
