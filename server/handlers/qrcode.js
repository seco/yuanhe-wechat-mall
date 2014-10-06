/**
 * weixin QR Code handler
 *
 * @author Minix Li
 */

var qrcode = require('../lib/weixin/qrcode');
var utils = require('../lib/util/utils');

/**
 * Show QR Code with scene id
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.withSceneId = function(req, res) {
  var scene_id = req.params.scene_id;

  qrcode.genQRCodeWithSceneId(scene_id, res, function(err) {
    console.log(err);
  });
};

/**
 * Show QR Code with url
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.withUrl = function(req, res) {
  var url = req.params.url;

  qrcode.genQRCodeWithUrl(url, res, function(err) {
    console.log(err);
  });
};
