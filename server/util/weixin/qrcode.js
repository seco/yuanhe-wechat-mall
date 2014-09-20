/**
 * weixin qrcode util
 *
 * @author Minix Li
 * @see http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码
 */

var request = require('request');
var app = require('../../app');
var commonUtil = require('./common');
var utils = require('../utils');

var exp = module.exports;

/**
 * Generate QRCode with given scene id
 *
 * @param {Number|String} scene_id
 * @param {Function} cb
 *
 * @public
 */
exp.genQRCodeWithSceneId = function(scene_id, cb) {
  if (isNaN(scene_id) || scene_id < 1 || scene_id > 100000) {
    utils.invokeCallback(cb, new Error('invalid scene id'));
    return;
  }

  createTicket(scene_id, function(err, ticket) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    getQRCodeWithTicket(ticket, function(err, data) {
      if (err) {
        utils.invokeCallback(cb, err);
        return;
      }
      utils.invokeCallback(cb, null, data);
    });
  });
};

/**
 * Generate QRCode with given url
 *
 * @param {String} url
 *
 * @public
 */
exp.genQRCodeWithUrl = function(url) {

};

/**
 * Create ticket for exchanging QRCode
 *
 * @param {Number|String} scene_id
 * @param {Function} cb
 *
 * @private
 */
var createTicket = function(scene_id, cb) {
  commonUtil.getAccessToken(function(err, access_token) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    request({
      url: composeCreateTicketUrl(access_token),
      method: 'POST',
      body: JSON.stringify({
        "action_name": "QR_LIMIT_SCENE",
        "action_info": { "scene": { "scene_id": scene_id } }
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
      if (data.errcode) {
        utils.invokeCallback(cb, new Error(data.errmsg));
        return;
      }
      utils.invokeCallback(cb, null, data.ticket);
    });
  });
};

/**
 * Get QRCode with ticket
 *
 * @param {String} ticket
 * @param {Function} cb
 *
 * @private
 */
var getQRCodeWithTicket = function(ticket, cb) {
  request({
    url: composeGetQRCodeUrl(ticket),
    method: 'GET'
  }, function(err, resp, body) {
    if (err) {
      utils.invokeCallback(err);
      return;
    }
    utils.invokeCallback(cb, null, body);
  });
};

/**
 * Compose request url to create ticket for exchanging QRCode
 *
 * @param {String} access_token
 *
 * @private
 *
 * @return {String}
 */
var composeCreateTicketUrl = function(access_token) {
  return 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=' + access_token;
};

/**
 * Compose request url to get QRCode with ticket
 *
 * @param {String} ticket
 *
 * @private
 *
 * @return {String}
 */
var composeGetQRCodeUrl = function(ticket) {
  return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + encodeURIComponent(ticket);
};
