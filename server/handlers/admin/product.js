/**
 * Administrate products
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var decisiontree = require(appPath + '/../lib/util/decisionTree');
var merchant = require(appPath + '/../lib/weixin/merchant');
var utils = require(appPath + '/../lib/util/utils');
var YuanheProduct = require(appPath + '/../models/yuanheProduct');

// product status
var ALL = 0;
var ONSHELF = 1;
var OFFSHELF = 2;

/**
 * Refresh products
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.refresh = function(req, res) {
  merchant.getProductsByStatus(ONSHELF, function(err, productsInfo) {
    var index = 0;
    var next = function(err) {
      if (err) {
        res.status(500).end();
        return;
      }
      if (index >= productsInfo.length) {
        res.status(200).end();
        return;
      }
      refreshHandler(productsInfo[index++], next);
    };
    next();
  });
};

/**
 * Refresh handler
 *
 * @param {Object} productInfo
 * @param {Function} cb
 */
var refreshHandler = function(productInfo, cb) {
  var startCtx = { 'productInfo': productInfo };

  decisiontree.auto({
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, startCtx);
    },
    decisionA: ['start', true, function(cb, context) {
      decisionAHandler(cb, context);
    }],
    endA: ['decisionA', true, function(cb, context) {
      endAHandler(cb, context);
    }],
    endB: ['decisionA', false, function(cb, context) {
      endBHandler(cb, context);
    }],
  }, function(err, context) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Decision A handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionAHandler = function(callback, context) {
  var cond = false;
  var ctx = {};

  var productInfo = context.productInfo;
  var productId = productInfo.product_id;

  async.waterfall([
    function(cb) {
      YuanheProduct.getByProductId(productId, cb);
    }
  ], function(err, product) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (product.get('_id')) { cond = true; }
    ctx = { 'productEntity': product };

    utils.invokeCallback(callback, null, cond, ctx);
  });
};

/**
 * End A handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endAHandler = function(callback, context) {
  var productInfo = context.productInfo;
  var productEntity = context.productEntity;

  async.waterfall([
    function(cb) {
      productEntity.set('weixin_product_info', productInfo);
      productEntity.save(cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};

/**
 * End B handler
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endBHandler = function(callback, context) {
  var productInfo = context.productInfo;
  var productEntity = context.productEntity;

  async.waterfall([
    function(cb) {
      productEntity.set('weixin_product_info', productInfo);
      productEntity.save(cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    utils.invokeCallback(callback, null);
  });
};
