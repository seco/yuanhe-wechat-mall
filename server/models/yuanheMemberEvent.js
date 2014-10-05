/**
 * YuanheMemberEvent
 *
 * Class representing a container for yuanhe member events
 *
 * @property {Object} member_id
 * @property {String} member_openid
 * @property {Object} object_id
 * @property {Object} annotation_id
 * @property {Date} posted
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
  var memberEvent = new YuanheMemberEvent();
  var opts = {
    'member_openid': openid,
    'type': 'subscribe'
  };
  memberEvent.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, memberEvent);
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
YuanheMemberEvent.getLastViewEvent = function(openid, cb) {
  var memberEvent = new YuanheMemberEvent();
  var opts = {
    'member_openid': openid,
    'type': 'view'
  };
  memberEvent.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, memberEvent);
  });
};

/**
 * Get the last member view event by openid and product id
 *
 * @param {String} openid
 * @param {Object} productId
 * @param {Function} cb
 *
 * @public
 */
YuanheMemberEvent.getLastViewEventByProductId = function(openid, productId, cb) {
  var memberEvent = new YuanheMemberEvent();
  var opts = {
    'member_openid': openid,
    'annotation_id': productId,
    'type': 'view'
  };
  memberEvent.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, memberEvent);
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

  this.attributes['member_id'] = null;
  this.attributes['member_openid'] = null;
  this.attributes['object_id'] = null;
  this.attributes['annotation_id'] = null;
  this.attributes['posted'] = null;
};

/**
 * Get object id
 *
 * @public
 *
 * @return {Object}
 */
pro.getObjectId = function() {
  return this.get('object_id');
};

/**
 * Get annotation id
 *
 * @public
 *
 * @return {Object}
 */
pro.getAnnotationId = function() {
  return this.get('annotation_id');
};

/**
 * Get posted
 *
 * @public
 *
 * @return {Date}
 */
pro.getPosted = function() {
  return this.get('posted');
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
