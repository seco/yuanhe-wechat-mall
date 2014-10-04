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
var dbProxy = require('../app').get('dbProxy');
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
    this.drawAttrFromDoc(doc);
    utils.invokeCallback(cb, null);
  });
};

/**
 * Draw attributes from entity document
 *
 * @param {Object} doc
 *
 * @protected
 */
pro.drawAttrFromDoc = function(doc) {
  for (var key in doc) {
    if (key in this.attributes) {
      this.attributes[key] = doc[key];
    }
  }
}

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
 * Save an entity
 *
 * @param {Function} cb
 *
 * @public
 */
pro.save = function(cb) {
  if (this.get('_id')) {
    updateDocument.apply(this, [cb]);
  } else {
    insertDocument.apply(this, [cb]);
  }
};

/**
 * Insert document
 *
 * @param {Function} cb
 *
 * @private
 */
var insertDocument = function(cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.insert(self.attributes, cb);
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    self.set('_id', result._id);
    utils.invokeCallback(cb, null, result);
  });
};

/**
 * Update document
 *
 * @param {Function} cb
 *
 * @private
 */
var updateDocument = function(cb) {
  var col_name = this.constructor.col_name;

  var self = this;
  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.update(
        { '_id': self.get('_id') },
        { '$set': self.attributes },
        cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, result);
  });
};

/**
 * export YuanheEntity
 */
module.exports = YuanheEntity;
