/**
 * Administrate products
 *
 * @author Minix Li, Bobby Tang
 */

var appPath = process.argv[1];

var async = require('async');
var decisiontree = require(appPath + '/../lib/util/decisionTree');
var merchantUtil = require(appPath + '/../lib/weixin/merchant');
var utils = require(appPath + '/../lib/util/utils');
var YuanheProduct = require(appPath + '/../models/yuanheProduct');

var app = require('../../app');
var db = app.get('db');
var dbProxy = app.get('dbProxy');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../lib/util/log').getLogger(__filename);

// product status
var ALL = 0;
var ONSHELF = 1;
var OFFSHELF = 2;

/**
 * show product list page
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.index = function(req, res, next) {
  var content = {};
  var limit = req.query.per_page;
  var skip = (req.query.page - 1) * req.query.per_page;
  var filter = {};

  logger.info('recevie backgrid request, set filter[' + JSON.stringify(filter) + '], limit[' + limit + '],skip[' + skip + ']');

  dbProxy.collection('products', function(err, col) {
    if (err) {
      logger.error(err);
    }
    col.count(filter, function(err, count) {
      if (err) {
        logger.error(err);
      }
      content.total_count = count;
      col.find(filter, {
        limit: limit,
        skip: skip,
        sort: {
          created_at: -1
        }
      }).toArray(function(err, result) {
        if (err) {
          logger.error(err);
        }
        content.items = result;

        res.json(content);
      });
    });
  });
};

/**
 * Refresh products
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @public
 */
exports.refresh = function(req, res) {
  // refresh product one by one
  merchantUtil.getProductsByStatus(ONSHELF, function(err, productsInfo) {
    var index = 0;
    var next = function(err) {
      if (err) {
        res.status(500).end();
        return;
      }
      if (index >= productsInfo.length) {
        res.end();
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
 *
 * @private
 */
var refreshHandler = function(productInfo, cb) {
  decisiontree.auto({
    // put product info into context and start decision A
    start: function(cb, context) {
      utils.invokeCallback(cb, null, true, {
        'productInfo': productInfo
      });
    },
    // check whether exists a product with the product id
    decisionA: ['start', true,
      function(cb, context) {
        decisionAHandler(cb, context);
      }
    ],
    // then set the product's weixin product info
    endA: ['decisionA', true,
      function(cb, context) {
        endAHandler(cb, context);
      }
    ],
    // save a new product
    endB: ['decisionA', false,
      function(cb, context) {
        endBHandler(cb, context);
      }
    ],
  }, function(err, context) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Check whether exists a product with the product id
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var decisionAHandler = function(callback, context) {
  var cond = false;
  var handlerCtx = {};

  var productInfo = context.productInfo;
  var productId = productInfo.product_id;

  async.waterfall([
    function(cb) {
      YuanheProduct.getByProductId(productId, cb);
    }
  ], function(err, productEntity) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }

    if (productEntity.exists()) {
      cond = true;
    }
    handlerCtx.productEntity = productEntity;

    utils.invokeCallback(callback, null, cond, handlerCtx);
  });
};

/**
 * Update product's weixin product info field
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endAHandler = function(callback, context) {
  var productInfo = context.productInfo;
  var productEntity = context.productEntity;

  var productId = productInfo['product_id'];

  async.waterfall([
    function(cb) {
      productEntity.setWeixinProductId(productId);
      productEntity.setWeixinProductInfo(productInfo);
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
 * Save new product
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @private
 */
var endBHandler = function(callback, context) {
  var productInfo = context.productInfo;
  var productEntity = context.productEntity;

  var productId = productInfo['product_id'];

  async.waterfall([
    function(cb) {
      productEntity.setWeixinProductId(productId);
      productEntity.setWeixinProductInfo(productInfo);
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
