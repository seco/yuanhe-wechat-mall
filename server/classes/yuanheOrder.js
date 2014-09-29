/**
 * YuanheOrder
 *
 * Class representing a container for yuanhe orders
 *
 * @property {Object} weixin_order_info
 * @property {Object} member
 * @property {Object} sales_store
 * @property {Object} member_store
 *
 * @author Minix Li
 */

var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

YuanheOrder = YuanheEntity.extend(function(id) {
  this.initializeAttributes();

  if (id) {
    this.load('orders', id, function() {
    });
  }
});

var pro = YuanheOrder.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
pro.initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['weixin_order_info'] = {};
  this.attributes['member'] = {};
  this.attributes['sales_store'] = {};
  this.attributes['member_store'] = {};
};

/**
 * export YuanheOrder
 */
module.exports = YuanheOrder;
