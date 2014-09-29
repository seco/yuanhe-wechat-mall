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
 * export YuanheMemberEvent
 */
module.exports = YuanheMemberEvent;
