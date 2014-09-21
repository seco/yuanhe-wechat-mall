/**
 * weixin QR Code handler
 *
 * @author Minix Li
 */

var qrcodeUtil = require('../util/weixin/qrcode');
var utils = require('../util/utils');

/**
 * Show QR Code with scene id
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.showWithSceneId = function(req, res) {
  var scene_id = req.params.scene_id;

  qrcodeUtil.genQRCodeWithSceneId(scene_id, res, function(err) {
    console.log(err);
  });
};

/**
 * Show QR Code with url
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.showWithUrl = function(req, res) {
  var url = req.params.url;

  qrcodeUtil.genQRCodeWithUrl(url, res, function(err) {
    console.log(err);
  });
};
