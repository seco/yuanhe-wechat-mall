/**
 * YuanheGlobalCounter
 *
 * @author Minix Li
 */

var async = require('async');
var dbProxy = require('../app').get('dbProxy');
var utils = require('../lib/util/utils');

// YuanheGlobalCounter constructor
YuanheGlobalCounter = function() {};

/**
 * Put collection name into class properties
 */
YuanheGlobalCounter.col_name = 'counters';

/**
 * Yield scene id
 *
 * @param {Function} cb
 *
 * @public
 */
YuanheGlobalCounter.yieldSceneId = function(cb) {
  var col_name = this.col_name;

  async.waterfall([
    function(cb) {
      dbProxy.collection(col_name, cb);
    },
    function(collection, cb) {
      collection.findAndModify(
        { '_id': 'scene_id' }, [], { $inc: { value: 1 } }, { new: true }, cb
      );
    }
  ], function(err, result) {
    if (err) {
      utils.invokeCallback(cb, err);
      return;
    }
    utils.invokeCallback(cb, null, result.value);
  });
};

/**
 * export YuanheGlobalCounter
 */
module.exports = YuanheGlobalCounter;
