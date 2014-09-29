/**
 * YuanheMember
 *
 * Class representing a container for yuanhe members
 *
 * @property {String} openid
 * @property {String} following_store_id
 * @property {String} time_following
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheEntity = require('./yuanheEntity');

// YuanheMember constructor
YuanheMember = function() {
  this.initializeAttributes();
};

// inherit from YuanheEntity
YuanheEntity.extend(YuanheMember);

// CLASS PROPERTIES  //////////////////////////////////////////////////////////

/**
 * Put collection name into class properties
 */
YuanheMember.collection_name = 'members';

/**
 * Get member by id
 *
 * @param {String} id
 * @param {Function} cb
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
 */
YuanheMember.getByOpenid = function(openid, cb) {
  var member = new YuanheMember();
};

// INSTANCE METHODS //////////////////////////////////////////////////////////

var pro = YuanheOrder.prototype;

/**
 * Initialize the attributes array
 *
 * @protected
 */
pro.initializeAttributes = function() {
  YuanheEntity.prototype.initializeAttributes.apply(this);

  this.attributes['openid'] = null;
  this.attributes['following_store_id'] = null;
  this.attributes['time_following'] = null;
};

/**
 * export YuanheOrder
 */
module.exports = YuanheOrder;
