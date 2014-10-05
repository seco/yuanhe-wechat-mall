/**
 * YuanheMemberEvent
 *
 * Class representing a container for yuanhe member events
 *
 * @property {String} type
 * @property {String} member_openid
 * @property {Object} store_id
 * @property {String} weixin_product_id
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheMemberEvent constructor
YuanheMemberEvent = function() {
  initializeAttributes.apply(this);
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheMemberEvent);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheMemberEvent.col_name = 'member_events';

/**
 * Get the last member subscribe event by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
YuanheMemberEvent.getLastSubscribeEvent = function(openid, cb) {
  var eventEntity = new YuanheMemberEvent();
  var opts = {
    'type': 'subscribe',
    'member_openid': openid
  };
  eventEntity.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, eventEntity);
  });
};

/**
 * Get the last member view event by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
YuanheMemberEvent.getLastViewEvent1 = function(openid, cb) {
  var eventEntity = new YuanheMemberEvent();
  var opts = {
    'type': 'view',
    'member_openid': openid
  };
  eventEntity.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, eventEntity);
  });
};

/**
 * Get the last member view event by openid and product id
 *
 * @param {String} openid
 * @param {String} productId
 * @param {Function} cb
 *
 * @public
 */
YuanheMemberEvent.getLastViewEvent2 = function(openid, productId, cb) {
  var eventEntity = new YuanheMemberEvent();
  var opts = {
    'type': 'view',
    'member_openid': openid,
    'weixin_product_id': productId
  };
  eventEntity.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, eventEntity);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheMemberEvent.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
var initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['type'] = null;
  this.attributes['member_openid'] = null;
  this.attributes['store_id'] = null;
  this.attributes['weixin_product_id'] = null;
};

/**
 * Set subscribe type
 *
 * @public
 */
pro.setSubscribeType = function() {
  this.set('type', 'subscribe');
};

/**
 * Set view type
 *
 * @public
 */
pro.setViewType = function() {
  this.set('type', 'view');
};

/**
 * Set member openid
 *
 * @param {String} openid
 *
 * @public
 */
pro.setMemberOpenid = function(openid) {
  this.set('member_openid', openid);
};

/**
 * Get store id
 *
 * @public
 *
 * @return {Object}
 */
pro.getStoreId = function() {
  return this.get('store_id');
};

/**
 * Get weixin product id
 *
 * @public
 *
 * @return {String}
 */
pro.getWeixinProductId = function() {
  return this.get('weixin_product_id');
};

/**
 * Load the last event attributes by opts
 *
 * @param {Object} opts
 * @param {Function} cb
 *
 * @public
 */
pro.loadLastByOpts = function(opts, cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findOne(
        opts, { 'sort': { 'posted': -1 } }, cb
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
 * export YuanheMemberEvent
 */
module.exports = YuanheMemberEvent;
