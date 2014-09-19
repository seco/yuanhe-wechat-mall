/**
 * qrcodeUtil
 *
 * @see http://mp.weixin.qq.com/wiki/index.php?title=生成带参数的二维码
 */

var request = require('request');
var app = require('../app');
var utils = require('./utils');

var qrcodeUtil = modules.exports = {};

/**
 * Generate QRCode with given scene id
 *
 * @param {Number} scene_id
 *
 * @public
 */
qrcodeUtil.genQRCodeWithSceneId = function(scene_id) {
  createTicket(scene_id, function(err, resp, body) {
    body = JSON.parse(body);

    getQRCodeWithTicket(body.ticket, function(err, resp, body) {
      utils.invokeCallback(cb, err, resp, body);
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
qrcodeUtil.genQRCodeWithUrl = function(url) {

};

/**
 * Create ticket for exchanging QRCode
 *
 * @param {Number} scene_id
 * @param {Function} cb
 *
 * @private
 */
var createTicket = function(scene_id, cb) {
  var access_token = app.get('access_token');
  var body = {"action_name": "QR_LIMIT_SCENE", "action_info": {"scene": {"scene_id": scene_id}}};

  request({
    url: composeCreateTicketUrl(access_token),
    method: 'POST',
    body: JSON.stringify(body)
  }, function(err, resp, body) {
    utils.invokeCallback(cb, err, resp, body);
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
    utils.invokeCallback(cb, err, resp, body);
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
 * Compose request url to get QRCode
 *
 * @param {String} ticket
 *
 * @private
 *
 * @return {String}
 */
var composeGetQRCodeUrl = function(ticket) {
  return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
};
