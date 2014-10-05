/**
 * YuanheOrder
 *
 * Class representing a container for yuanhe orders
 *
 * @property {String} weixin_order_id
 * @property {Object} weixin_order_info
 * @property {Array}  stores
 * @property {Object} member
 * @property {String} state
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheOrder constructor
YuanheOrder = function() {
  initializeAttributes.apply(this);
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheOrder);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheOrder.col_name = 'orders';

/**
 * Get order by _id
 *
 * @param {Object} _id
 * @param {Function} cb
 */
YuanheOrder.getById = function(_id, cb) {
  var orderEntity = new YuanheOrder();

  orderEntity.load(id, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, orderEntity);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheOrder.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
var initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['weixin_order_id'] = null;
  this.attributes['weixin_order_info'] = null;
  this.attributes['stores'] = null;
  this.attributes['member'] = null;
  this.attributes['state'] = 'created';
};

/**
 * Set weixin order id
 *
 * @param {String} orderId
 *
 * @public
 */
pro.setWeixinOrderId = function(orderId) {
  this.set('weixin_order_id', orderId);
};

/**
 * Set weixin order info
 *
 * @param {Object} orderInfo
 *
 * @public
 */
pro.setWeixinOrderInfo = function(orderInfo) {
  this.set('weixin_order_info', orderInfo);
};

/**
 * Set both sales and member stores
 *
 * @param {Object} sales_store
 * @param {Object} channel_store
 * @param {Function} cb
 *
 * @public
 */
pro.setBothStores = function(sales_store, channel_store, cb) {};

/**
 * export YuanheOrder
 */
module.exports = YuanheOrder;
