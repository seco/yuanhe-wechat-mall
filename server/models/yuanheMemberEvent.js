/**
 * YuanheMemberEvent
 *
 * Class representing a container for yuanhe member events
 *
 * @property {String} member_id
 * @property {String} member_openid
 * @property {String} object_id
 * @property {String} annotation_id
 * @property {String} posted
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheMemberEvent constructor
YuanheMemberEvent = function() {
  this.initializeAttributes();
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheMemberEvent);

// CLASS PROPERTIES //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheMemberEvent.col_name = 'member_events';

/**
 * Get the last member event by openid
 *
 * @param {Object} opts
 * @param {Function} cb
 */
YuanheMemberEvent.getLastByOpts = function(opts, cb) {
  var event = new YuanheMemberEvent();

  event.loadLastByOpts(opts, function(err) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, event);
  });
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheMemberEvent.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
pro.initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['member_id'] = null;
  this.attributes['member_openid'] = null;
  this.attributes['object_id'] = null;
  this.attributes['annotation_id'] = null;
  this.attributes['posted'] = null;
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

  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.find(
        opts,
        { 'limit': 1, 'sort': { 'time_created': -1 } },
        cb
      );
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
 * export YuanheMemberEvent
 */
module.exports = YuanheMemberEvent;
