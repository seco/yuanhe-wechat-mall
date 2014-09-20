/**
 * weixin oauth util
 *
 * @author Minix Li
 * @see http://mp.weixin.qq.com/wiki/index.php?title=网页授权获取用户基本信息
 */

var request = require('request');
var app = require('../../app');
var utils = require('../utils');

var exp = module.exports;

/**
 * Get the user's basic info who has agreed to authorize
 *
 * @param {Object} req
 * @param {Function} cb
 *
 * @public
 */
exp.getUserInfo = function(req, cb) {
  if (!req.query.code) {
    utils.invokeCallback(cb, new Error('code should be passed'));
    return;
  }
  var code = req.query.code;

  getAccessToken(code, function(err, data) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    try {
      data = JSON.parse(data);
    } catch(e) {
      utils.invokeCallback(cb, err);
      return;
    }
    if (data.errcode) {
      utils.invokeCallback(cb, new Error(data.errmsg));
      return;
    }

    var access_token = data.access_token;
    var openid = data.openid;

    pullUserInfo(access_token, openid, function(err, data) {
      if (err) {
        utils.invokeCallback(cb, err);
        return;
      }
      try {
        data = JSON.parse(data);
      } catch(e) {
        utils.invokeCallback(cb, err);
        return;
      }
      if (data.errcode) {
        utils.invokeCallback(cb, new Error(data.errmsg));
        return;
      }
      utils.invokeCallback(cb, null, data);
    });
  });
};

/**
 * Get access token by authorization code
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
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, body);
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
    url: composePullUserInfoUrl(access_token, openid),
    method: 'GET'
  }, function(err, resp, body) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, body);
  });
};

/**
 * Compose request url to get access token
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
 *
 * @private
 *
 * @return {String}
 */
var composePullUserInfoUrl = function(access_token, openid) {
  return 'https://api.weixin.qq.com/sns/userinfo?access_token='
    + access_token + '&openid=' + openid + '&lang=zh_CN';
};
