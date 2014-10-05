/**
 * YuanheProduct
 *
 * Class representing a container for yuanhe products
 *
 * @property {String} weixin_product_info
 * @property {String} redirect_url
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheProduct constructor
YuanheProduct = function() {
  initializeAttributes.apply(this);
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
  var product = new YuanheProduct();

  product.loadByProductId(productId, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, product);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheProduct.prototype;

/**
 * Initialize the attributes array
 *
 * @private
 */
var initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['weixin_product_info'] = null;
  this.attributes['redirect_url'] = null;
};

/**
 * Load product attributes by product id
 *
 * @param {String} productId
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
        { 'weixin_product_info.product_id': productId }, cb
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
 * export YuanheProduct
 */
module.exports = YuanheProduct;
