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
var ObjectID = require('mongodb').ObjectID;
var config = require('../app').get('yuanhe_config');
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
  this.attributes['stores'] = [];
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
 * Set member
 *
 * @param {String} openid
 * @param {String} name
 *
 * @public
 */
pro.setMember = function(openid, name) {
  this.set('member', {
    'member_openid': openid,
    'member_name': name
  });
};

/**
 * Set both sales and member stores
 *
 * @param {Null|Object} storeId
 * @param {String} storeName
 *
 * @public
 */
pro.setBothStores = function(storeId, storeName) {
  if (!storeId) {
    storeId = new ObjectID(config['yuanhe_store_id']);
    storeName = config['yuanhe_store_name'];
  }

  var salesStore = {
    'store_id': storeId,
    'store_name': storeName,
    'store_type': 'sales',
    'commission': 0
  };
  var channelStore = {
    'store_id': storeId,
    'store_name': storeName,
    'store_type': 'channel',
    'commission': 0
  };

  this.attributes['stores'][0] = salesStore;
  this.attributes['stores'][1] = channelStore;
};

/**
 * Set sales store
 *
 * @param {Null|Object} storeId
 * @param {String} storeName
 *
 * @public
 */
pro.setSalesStore = function(storeId, storeName) {
  if (!storeId) {
    storeId = new ObjectID(config['yuanhe_store_id']);
    storeName = config['yuanhe_store_name'];
  }

  var salesStore = {
    'store_id': storeId,
    'store_name': storeName,
    'store_type': 'sales',
    'commission': 0
  };

  this.attributes['stores'][0] = salesStore;
};

/**
 * Set channel store
 *
 * @param {Null|Object} storeId
 * @param {String} storeName
 *
 * @public
 */
pro.setChannelStore = function(storeId, storeName) {
  if (!storeId) {
    storeId = new ObjectID(config['yuanhe_store_id']);
    storeName = config['yuanhe_store_name'];
  }

  var channelStore = {
    'store_id': storeId,
    'store_name': storeName,
    'store_type': 'channel',
    'commission': 0
  };

  this.attributes['stores'][1] = channelStore;
};

/**
 * export YuanheOrder
 */
module.exports = YuanheOrder;
