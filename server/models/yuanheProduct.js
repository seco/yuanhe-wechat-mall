/**
 * YuanheProduct
 *
 * Class representing a container for yuanhe products
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheProduct constructor
YuanheProduct = function() {
  this.initializeAttributes();
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
 */
YuanheProduct.getByProductId = function(productId, cb) {
};

/**
 * export YuanheProduct
 */
module.exports = YuanheProduct;
