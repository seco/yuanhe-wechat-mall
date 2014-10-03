/**
 * @author Minix Li
 */

var async = require('async');
var decisiontree = require('../../lib/util/decisionTree');
var merchant = require('../../lib/weixin/merchant');
var utils = require('../../lib/util/utils');
var YuanheProduct = require('../../classes/yuanheProduct');

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
  merchant.getProductsByStatus(ONSHELF, function(err, products_info) {
    var index = 0;
    var next = function(err) {
      if (err) {
        res.status(500).end();
        return;
      }
      if (index >= product_info.length) {
        res.status(200).end();
        return;
      }
      refreshHandler(products_info[index++], next);
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
  var productId = product_info.product_id;

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
        if (product) { cond = true; }
        ctx = { 'product': product };
        utils.invokeCallback(cb, null, cond, ctx);
      });
    },

    endA: ['decisionA', true, function(cb, context) {
      var product = context.product;

      async.waterfall([
        function(cb) {
          product.set('product_info', productInfo);
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
      async.waterfall([
        function(cb) {
          var product = new YuanheProduct();
          product.set('product_info', productInfo);
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

  });
};
