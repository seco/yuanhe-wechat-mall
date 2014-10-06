/**
 * Product handlers
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var oauthUtil = require(appPath + '/../lib/weixin/oauth');
var utils = require(appPath + '/../lib/util/utils');
var YuanheMemberEvent = require(appPath + '/../models/yuanheMemberEvent');
var YuanheStore = require(appPath + '/../models/yuanheStore');

/**
 * Product promotion handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.promotion = function(req, res) {
  var storeOpenid = req.params.store_openid;
  var weixinProductId = req.params.weixin_product_id;

  var eventEntity = new YuanheMemberEvent();

  eventEntity.setViewType();
  eventEntity.setWeixinProductId(wexinProductId);

  async.waterfall([
    function(cb) {
      oauthUtil.getUserInfo(req, cb);
    },
    function(userInfo, cb) {
      eventEntity.setMemberOpenid(userInfo.openid);
      YuanheStore.getByOpenid(storeOpenid, cb);
    },
    function(storeEntity, cb) {
      eventEntity.setStoreId(storeEntity.getId());
      eventEntity.setStoreName(storeEntity.getStoreName());
      eventEntity.save(cb);
    }
  ], function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.redirect('');
  });
};
