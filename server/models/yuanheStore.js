/**
 * YuanheStore
 *
 * Class representing a container for yuanhe stores
 *
 * @property {String}  openid
 * @property {Number}  scene_id
 * @property {String}  store_name
 * @property {String}  store_type
 * @property {String}  store_address
 * @property {String}  telnum
 * @property {String}  alias
 * @property {String}  contact_name
 * @property {Date}    following_at
 * @property {Boolean} unfollow
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheStore constructor
YuanheStore = function() {
  initializeAttributes.apply(this);
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheStore);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheStore.col_name = 'stores';

/**
 * Get store by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
YuanheStore.getByOpenid = function(openid, cb) {
  var storeEntity = new YuanheStore();

  storeEntity.loadByOpenid(openid, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, storeEntity);
  });
};

/**
 * Get store by scene id
 *
 * @param {Number} sceneId
 * @param {Function} cb
 */
YuanheStore.getBySceneId = function(sceneId, cb) {
  var storeEntity = new YuanheStore();

  storeEntity.loadBySceneId(sceneId, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, storeEntity);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheStore.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
var initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['openid'] = null;
  this.attributes['scene_id'] = 0;
  this.attributes['store_name'] = null;
  this.attributes['store_type'] = null;
  this.attributes['store_address'] = null;
  this.attributes['telnum'] = null;
  this.attributes['alias'] = null;
  this.attributes['contact_name'] = null;
  this.attributes['following_at'] = null;
  this.attributes['unfollow'] = true;
};

/**
 * Set openid
 *
 * @param {String} openid
 *
 * @public
 */
pro.setOpenid = function(openid) {
  this.set('openid', openid);
};

/**
 * Set scene id
 *
 * @param {Number} sceneId
 *
 * @public
 */
pro.setSceneId = function(sceneId) {
  this.set('scene_id', sceneId);
};

/**
 * Get store name
 *
 * @public
 *
 * @return {String}
 */
pro.getStoreName = function() {
  return this.get('store_name');
};

/**
 * Set following
 *
 * @public
 */
pro.setFollowing = function() {
  this.set('unfollow', false);
  this.set('following_at', new Date());
};

/**
 * Load store attributes by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
pro.loadByOpenid = function(openid, cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findOne({ 'openid': openid }, cb);
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
 * Load store attributes by scene id
 *
 * @param {Number} sceneId
 * @param {Function} cb
 *
 * @public
 */
pro.loadBySceneId = function(sceneId, cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findOne({ 'scene_id': sceneId }, cb);
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
 * export YuanheStore
 */
module.exports = YuanheStore;
