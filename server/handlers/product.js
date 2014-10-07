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
 * @return {Object}
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

    var productName = productEntity.getProductName();
    var weixinProductId = productEntity.getWeixinProductId();

    var promotionUrl = utils.getUrl([
      'products', storeOpenid, weixinProductId, 'promotion'
    ]);

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
 *
 * @public
 */
exports.show = function(req, res) {
  var storeOpenid = req.params.store_openid;
  var weixinProductId = req.params.product_id;

  async.waterfall([
    function(cb) {
      YuanheProduct.getByProductId(weixinProductId, cb)
    }
  ], function(err, productEntity) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.render('product/show1', getShowViewOpts({
      'storeOpenid': storeOpenid,
      'productEntity': productEntity
    }));
  });
};

/**
 * Get list view options
 *
 * @param {Object} opts
 *
 * @return {Object}
 *
 * @private
 */
var getShowViewOpts = function(opts) {
  var storeOpenid = opts.storeOpenid;
  var productEntity = opts.productEntity;

  var productId = productEntity.getWeixinProductId();
  var productName = productEntity.getProductName();
  var productImgUrl = productEntity.getProductImgUrl();

  var promotionUrl = utils.getUrl([
    'products', storeOpenid, weixinProductId, 'promotion'
  ]);
  var qrCodeImgUrl = utils.getUrl([
    'qrcode', 'url', encodeURIComponent(promotionUrl)
  ]);

  return {
    'productId': productId,
    'productName': productName,
    'productImgUrl': productImgUrl,
    'qrCodeImgUrl': qrCodeImgUrl
  };
};


/**
 * Product promotion handler
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
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
    res.redirect(utils.getUrl([
      'products', storeOpenid, weixinProductId
    ]));
  });
};
