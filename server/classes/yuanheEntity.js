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

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');
var YuanheData = require('./yuanheData');

/**
 * YuanheEntity constructor
 */
YuanheEntity = function() {
  throw new Error("Can't instantiate abstract classes");
};

YuanheData.extend(YuanheEntity);

var pro = YuanheEntity.prototype;

/**
 * Initialize the attributes object
 *
 * @protected
 */
pro.initializeAttributes = function() {
  YuanheData.prototype.initializeAttributes.apply(this);

  this.attributes['_id'] = null;
  this.attributes['time_created'] = null;
  this.attributes['time_updated'] = null;
  this.attributes['enabled'] = 'yes';
};

/**
 * Load attributes from the entity collection into the object
 *
 * @param {String} id
 * @param {Function} cb
 *
 * @protected
 */
pro.load = function(id, cb) {
  var col_name = this.constructor.col_name;

  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findOne({ "_id": id }, cb);
    }
  ], function(err, doc) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    for (var field in doc) {
      if (field in this.attributes) {
        this.attributes[field] = doc[field];
      }
    }
    utils.invokeCallback(cb, null);
  });
};

/**
 * Return the value of a property
 *
 * @param {String} name
 *
 * @public
 */
pro.get = function(name) {
  return this.attributes[name];
};

/**
 * Set the value of a property
 *
 * @param {String} name
 * @param {Object} value
 *
 * @public
 */
pro.set = function(name, value) {
  this.attributes[name] = value;
};

/**
 * export YuanheEntity
 */
module.exports = YuanheEntity;
