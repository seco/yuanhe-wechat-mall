/**
 * YuanheStore
 *
 * Class representing a container for yuanhe stores
 *
 * @property {String} openid
 * @property {Number} scene_id
 * @property {String} name
 * @property {String} type
 * @property {String} address
 * @property {String} telnum
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
 * Get store by scene id
 *
 * @param {String} sceneId
 * @param {Function} cb
 */
YuanheStore.getBySceneId = function(sceneId, cb) {
  var store = new YuanheStore();

  store.loadBySceneId(sceneId, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, store);
  });
};

/**
 * Get store by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
YuanheStore.getByOpenid = function(openid, cb) {
  var store = new YuanheStore();

  store.loadByOpenid(openid, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, store);
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
  this.attributes['name'] = null;
  this.attributes['type'] = null;
  this.attributes['address'] = null;
  this.attributes['telnum'] = null;
};

/**
 * Load store attributes by scene id
 *
 * @param {String} sceneId
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
 * Set scene id
 *
 * @param {String} sceneId
 *
 * @public
 */
pro.setSceneId = function(sceneId) {
  this.set('scene_id', sceneId);
};


/**
 * Set following
 *
 * @public
 */
pro.setFollowing = function() {
  this.set('status', 'following');
  this.set('time_following', new Date());
};

/**
 * export YuanheStore
 */
module.exports = YuanheStore;
