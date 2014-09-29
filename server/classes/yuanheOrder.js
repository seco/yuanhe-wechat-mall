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

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

/**
 * YuanheOrder constructor
 */
YuanheOrder = function() {
  this.name = 'orders';
  this.initializeAttributes();
};

YuanheEntity.extend(YuanheOrder);

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
 * Load attributes from the order collection into the object
 *
 * @param {String} order_id
 * @param {Function} cb
 *
 * @public
 */
pro.load = function(order_id, cb) {
  this.load(this.name, order_id, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null);
  });
}

/**
 * Update both sales and member stores
 *
 * @param {String} sales_store_id
 * @param {String} member_store_id
 * @param {Function} cb
 *
 * @public
 */
pro.updateStores = function(sales_store_id, member_store_id, cb) {
  var sales_store_value = { "id": sales_store_id };
  var member_store_value = { "id": member_store_id };

  async.waterfall([
    function(cb) {
      dbProxy.collection(this.name, cb);
    },
    function(collection, cb) {
      collection.update(
        { "_id": this.get('_id') },
        { "$set": {
          "sales_store": sales_store_value,
          "member_store": member_store_value
        } },
        cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }

    this.set('sales_store', sales_store_value);
    this.set('member_store', member_store_value);

    utils.invokeCallback(cb, null);
  });
};

/**
 * export YuanheOrder
 */
module.exports = YuanheOrder;
