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
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheStore constructor
YuanheStore = function() {
  this.initializeAttributes();
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

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheStore.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
pro.initializeAttributes = function() {
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
    this.drawAttrFromDoc(doc);
    utils.invokeCallback(cb, null);
  });
};
/**
 * export YuanheStore
 */
module.exports = YuanheStore;
