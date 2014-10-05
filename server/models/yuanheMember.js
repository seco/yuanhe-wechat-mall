/**
 * YuanheMember
 *
 * Class representing a container for yuanhe members
 *
 * @property {String} openid
 * @property {Object} channel_store_id
 * @property {Date}   following_at
 * @property {Boolean} unfollow
 *
 * @author Minix Li
 */

var async = require('async');
var config = require('../app').get('yuanhe_config');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheMember constructor
YuanheMember = function() {
  initializeAttributes.apply(this);
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheMember);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheMember.col_name = 'members';

/**
 * Get member by _id
 *
 * @param {Object} _id
 * @param {Function} cb
 *
 * @public
 */
YuanheMember.getById = function(_id, cb) {
  var memberEntity = new YuanheMember();

  memberEntity.load(_id, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, memberEntity);
  });
};

/**
 * Get member by openid
 *
 * @param {String} openid
 * @param {Function} cb
 *
 * @public
 */
YuanheMember.getByOpenid = function(openid, cb) {
  var memberEntity = new YuanheMember();

  memberEntity.loadByOpenid(openid, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, memberEntity);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheMember.prototype;

/**
 * Initialize the attributes array
 *
 * @private
 */
var initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['openid'] = null;
  this.attributes['channel_store_id'] = null;
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
 * Set channel store of the member
 *
 * @param {Null|Object} storeId
 *
 * @public
 */
pro.setChannelStore = function(storeId) {
  if (!storeId) {
    storeId = new ObjectID(config['yuanhe_store_id']);
  }

  this.attributes['channel_store_id'] = storeId;
};

/**
 * Check whether channel store is set
 *
 * @public
 *
 * @return {Boolean}
 */
pro.hasChannelStore = function() {
  if (this.get('channel_store_id')) {
    return true;
  }
  return false;
};

/**
 * Get channel store id
 *
 * @public
 *
 * @return {Object}
 */
pro.getChannelStore = function() {
  return this.get('channel_store_id');
};

/**
 * Set following
 *
 * @public
 */
pro.setFollowing = function() {
  this.set('unfollow', true);
  this.set('following_at', new Date());
};

/**
 * Load member attributes by openid
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
 * export YuanheMember
 */
module.exports = YuanheMember;
