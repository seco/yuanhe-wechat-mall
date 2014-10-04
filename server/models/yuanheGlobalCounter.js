/**
 * YuanheGlobalCounter
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').dbProxy;
var utils = require('../lib/util/utils');

// YuanheGlobalCounter constructor
YuanheGlobalCounter = function() {};

/**
 * Put collection name into class properties
 */
YuanheGlobalCounter.col_name = 'global_counters';

/**
 * Yield scene id
 *
 * @param {Function} cb
 */
YuanheGlobalCounter.yieldSceneId = function(cb) {
  var col_name = this.col_name;

  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findAndModify({ '_id': 'scene_id' }, [], { $inc: { value: 1 } }, { new: true }, cb);
    }
  ], function(err, doc) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, doc.value);
  });
};

/**
 * export YuanheGlobalCounter
 */
module.exports = YuanheGlobalCounter;