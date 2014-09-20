/**
 * qrcode handlers
 */

var qrcodeUtil = require('../util/weixin/qrcode');
var utils = require('../util/utils');

/**
 * show handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.show = function(req, res) {
  var scene_id = req.params.scene_id;

  qrcodeUtil.genQRCodeWithSceneId(scene_id, function(err, data) {
    console.log(data);
  });
};
