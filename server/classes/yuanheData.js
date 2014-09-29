/**
 * A generic class that contains shared code b/w YuanheEntity
 *
 * @property {String} time_created
 *
 * @author Minix Li
 */
var YuanheData = function() {
  throw new Error("Can't instantiate abstract classes");
};

/**
 * Initialize the attributes object
 *
 * @protected
 */
YuanheData.prototype.initializeAttributes = function() {
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
