/**
 * utils
 */

var utils = module.exports;

/**
 * Check and invoke callback
 */
utils.invokeCallback = function(cb) {
  if (!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};
