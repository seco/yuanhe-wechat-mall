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

YuanheEntity = YuanheData.extend(function() {
  throw new Error("Can't instantiate abstract classes");
});

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
 * Loads attributes from the entities collection into the object
 *
 * @param {String} name collection name
 * @param {String} id document id
 * @param {Function} cb callback
 *
 * @protected
 */
pro.load = function(name, id, cb) {
  async.waterfall([
    function(cb) {
      dbProxy.collection(name, cb);
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
 * export YuanheEntity
 */
module.exports = YuanheEntity;
