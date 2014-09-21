/**
 * weixin merchant util
 *
 * @author Minix Li
 * @see http://mp.weixin.qq.com/wiki/index.php?title=微信小店接口
 */

var request = require('request');
var app = require('../../app');
var utils = require('../utils');

var exp = module.exports;

/**
 * Get products of specified status
 *
 * @param {Number} status
 * @param {Function} cb
 *
 * @public
 */
exp.getProductsByStatus = function(status, cb) {
  commonUtil.getAccessToken(function(err, access_token) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    request({
      url: composeGetProductsByStatusUrl(access_token),
      method: 'POST',
      body: JSON.stringify({
        "status": status
      })
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
      if (data.errcode !== 0) {
        utils.invokeCallback(cb, new Error(data.errmsg));
        return;
      }
      utils.invokeCallback(cb, null, data.products_info);
    });
  });
};

/**
 * Compose request url to get products by status
 */
var composeGetProductsByStatusUrl = function(access_token) {
  return 'https://api.weixin.qq.com/merchant/getbystatus?access_token=' + access_token;
};
