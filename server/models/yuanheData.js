/**
 * A generic class that contains shared code b/w YuanheEntity
 *
 * @property {String} time_created
 *
 * @author Minix Li
 */

/**
 * YuanheData constructor
 */
var YuanheData = function() {
  throw new Error("Can't instantiate abstract classes");
};

var pro = YuanheData.prototype;

/**
 * Initialize the attributes object
 *
 * @protected
 */
pro.initializeAttributes = function() {
  // create attributes object if not already created
  if (typeof this.attributes === 'undefined') {
    this.attributes = {};
  }

  this.attributes['time_created'] = null;
};

/**
 * export YuanheData
 */
module.exports = YuanheData;
