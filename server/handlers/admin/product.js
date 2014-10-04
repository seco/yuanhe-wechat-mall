/**
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var decisiontree = require(appPath + '/../lib/util/decisionTree');
var merchant = require(appPath + '/../lib/weixin/merchant');
var utils = require(appPath + '/../lib/util/utils');
var YuanheProduct = require(appPath + '/../models/yuanheProduct');

// status
var ALL = 0;
var ONSHELF = 1;
var OFFSHELF = 2;

/**
 * Refresh products
 *
 * @param {Object} req
 * @param {Object} res
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
  var productId = productInfo.product_id;

  decisiontree.auto({
    decisionA: function(cb, context) {
      var cond = false;
      var ctx = {};

      async.waterfall([
        function(cb) {
          YuanheProduct.getByProductId(productId, cb);
        }
      ], function(err, product) {
        if (err) {
          utils.invokeCallback(cb, err);
          return;
        }

        if (product.get('_id')) { cond = true; }
        ctx = { 'product': product };

        utils.invokeCallback(cb, null, cond, ctx);
      });
    },

    endA: ['decisionA', true, function(cb, context) {
      var product = context.product;

      async.waterfall([
        function(cb) {
          product.set('weixin_product_info', productInfo);
          product.save(cb);
        }
      ], function(err, result) {
        if (err) {
          utils.invokeCallback(cb, err);
          return;
        }
        utils.invokeCallback(cb, null);
      });
    }],

    endB: ['decisionA', false, function(cb, context) {
      var product = context.product;

      async.waterfall([
        function(cb) {
          product.set('weixin_product_info', productInfo);
          product.save(cb);
        }
      ], function(err, result) {
        if (err) {
          utils.invokeCallback(cb, err);
          return;
        }
        utils.invokeCallback(cb, null);
      });
    }],
  }, function(err, context) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};
