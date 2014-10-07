/**
 * YuanheProduct
 *
 * Class representing a container for yuanhe products
 *
 * @property {String} weixin_product_id
 * @property {Object} weixin_product_info
 * @property {String} redirect_url
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

/**
 * YuanheProduct constructor
 *
 * @param {Null|Object} doc
 *
 * @public
 */
YuanheProduct = function(doc) {
  initializeAttributes.apply(this);
  if (doc) {
    this.drawAttrFromDoc(doc);
  }
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheProduct);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheProduct.col_name = 'products';

/**
 * Get product by product id
 *
 * @param {String} productId
 * @param {Function} cb
 *
 * @public
 */
YuanheProduct.getByProductId = function(productId, cb) {
  var productEntity = new YuanheProduct();

  productEntity.loadByProductId(productId, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, productEntity);
  });
};

/**
 * Get all products
 *
 * @param {Function} cb
 *
 * @public
 */
YuanheProduct.getAllProducts = function(cb) {
  var result = [];
  YuanheEntity.getAllEntities.apply(this, [function(err, docs) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    for (var key in docs) {
      result.push(new YuanheProduct(docs[key]));
    }
    utils.invokeCallback(cb, null, result);
  }]);
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheProduct.prototype;

/**
 * Initialize the attributes array
 *
 * @param {Object} doc
 *
 * @private
 */
var initializeAttributes = function(doc) {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['weixin_product_id'] = null;
  this.attributes['weixin_product_info'] = null;
  this.attributes['redirect_url'] = null;
};

/**
 * Set weixin product id
 *
 * @param {String} productId
 *
 * @public
 */
pro.setWeixinProductId = function(productId) {
  this.set('weixin_product_id', productId);
};

/**
 * Get weixin product id
 *
 * @public
 *
 * @return {String}
 */
pro.getWeixinProductId = function() {
  return this.get('weixin_product_id');
};

/**
 * Set weixin product info
 *
 * @param {Object} productInfo
 *
 * @public
 */
pro.setWeixinProductInfo = function(productInfo) {
  this.set('weixin_product_info', productInfo);
};

/**
 * Get weixin product info
 *
 * @public
 */
pro.getWeixinProductInfo = function() {
  return this.get('weixin_product_info');
};

/**
 * Get weixin product name
 *
 * @public
 */
pro.getProductName = function() {
  return this.getWeixinProductInfo().name;
};

/**
 * Get promotion url
 *
 * @param {String} storeOpenid
 *
 * @public
 */
pro.getPromotionUrl = function(storeOpenid) {
  return utils.getUrl([
    'products', storeOpenid, this.getWeixinProductId(), 'promotion'
  ]);
};

/**
 * Load product attributes by product id
 *
 * @param {String} productId
 * @param {Function} cb
 *
 * @public
 */
pro.loadByProductId = function(productId, cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findOne(
        { weixin_product_id: productId }, cb
      );
    }
  ], function(err, doc) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    if (doc) {
      self.drawAttrFromDoc(doc);
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * export YuanheProduct
 */
module.exports = YuanheProduct;
