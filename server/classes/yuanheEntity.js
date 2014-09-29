/**
 * The parent class for all Yuanhe Entities.
 *
 * @property {String} _id
 * @property {String} time_created
 * @property {String} time_updated
 * @property {String} enabled
 *
 * @author Minix Li
 */

var YuanheData = require('./yuanheData');

YuanheEntity = function() {
  throw new Error("Can't instantiate abstract classes");
};

/**
 * Initialize the attributes object
 *
 * @protected
 */
YuanheEntity.prototype.initializeAttributes = function() {
  YuanheData.prototype.initializeAttributes.apply(this);

  this.attributes['_id'] = null;
  this.attributes['time_created'] = null;
  this.attributes['time_updated'] = null;
  this.attributes['enabled'] = 'yes';
};

/**
 * export YuanheEntity
 */
module.exports = YuanheData.extend(YuanheEntity);
