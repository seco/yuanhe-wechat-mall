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
var YuanheProduct = require(appPath + '/../models/YuanheProduct');
var YuanheStore = require(appPath + '/../models/yuanheStore');

/**
 * Product index handler
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.list = function(req, res) {
  var storeOpenid = req.params.store_openid;

  async.waterfall([
    function(cb) {
      YuanheProduct.getAllProducts(cb);
    }
  ], function(err, productEntities) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.render('product/list', getListViewOpts({
      'storeOpenid': storeOpenid,
      'productEntities': productEntities
    }));
  });
};

/**
 * Get list view options
 *
 * @param {Object} opts
 *
 * @private
 */
var getlistViewOpts = function(opts) {
  var storeOpenid = opts.storeOpenid;
  var productEntities = opts.productEntities;

  var result = {};
  result.products = [];

  for (var key in productEntities) {
    var productEntity = productEntities[key];

    var productName = product.getProductName();
    var promotionUrl = product.getPromotionUrl(storeOpenid);

    result.products.push({
      'productName': productName,
      'promotionUrl': promotionUrl
    });
  }

  return result;
};

/**
 * Product show handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.show = function(req, res) {
  var storeOpenid = req.params.store_openid;
  var weixinProductId = req.params.product_id;
};

/**
 * Product promotion handler
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.promotion = function(req, res) {
  var storeOpenid = req.params.store_openid;
  var weixinProductId = req.params.product_id;

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
