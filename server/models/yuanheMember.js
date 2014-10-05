/**
 * YuanheMember
 *
 * Class representing a container for yuanhe members
 *
 * @property {String} openid
 * @property {String} channel_store_id
 * @property {String} time_following
 *
 * @author Minix Li
 */

var async = require('async');
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
 * Get member by id
 *
 * @param {String} id
 * @param {Function} cb
 *
 * @public
 */
YuanheMember.getById = function(id, cb) {
  var member = new YuanheMember();

  member.load(id, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, member);
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
  var member = new YuanheMember();

  member.loadByOpenid(openid, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, member);
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
  this.attributes['time_following'] = null;
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
 * Update channel store of the member
 *
 * @param {String} store_id
 * @param {Function} cb
 *
 * @public
 */
pro.updateChannelStore = function(store_id, cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.update(
        { '_id': self.get('_id') },
        { '$set': { 'channel_store_id': store_id } }, cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    self.set('channel_store_id', store_id);
    utils.invokeCallback(cb, null);
  });
};

/**
 * Check whether is set channel store
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
 * @return {null|String}
 */
pro.getChannelStore = function() {
  return this.get('channel_store_id');
}

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
 * export YuanheMember
 */
module.exports = YuanheMember;
