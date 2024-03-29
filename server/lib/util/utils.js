/**
 * Utils
 *
 * @author Minix Li
 */

var app = require('../../app');

var utils = module.exports;

/**
 * Check and invoke callback
 *
 * @param {Function} cb
 *
 * @public
 */
utils.invokeCallback = function(cb) {
  if (!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * Get site url
 *
 * @public
 *
 * @return {String}
 */
utils.getSiteUrl = function() {
  return app.get('yuanhe_config').siteurl;
};

/**
 * Get url by segments
 *
 * @param {Array} segments
 *
 * @public
 *
 * @return {String}
 */
utils.getUrl = function(segments) {
  segments.unshift(utils.getSiteUrl());
  return segments.join('/');
};

/**
 * Check whether a date is in the given past days
 *
 * @param {Date} date
 * @param {Number} days
 *
 * @public
 *
 * @return {Boolean}
 */
utils.checkInPastDays = function(date, days) {
  var now = new Date();
  var mseconds = days*(24*3600000);
  if ((now - date) <= mseconds) {
    return true;
  }
  return false;
};

/**
 * Define extend as a method of the superclass constructor
 */
Function.prototype.extend = function(constructor, methods, statics) {
  return defineSubclass(this, constructor, methods, statics);
};

/**
 * A simple function for creating simple subclasses
 *
 * @param {Function} superclass
 * @param {Function} constructor
 * @param {Object} methods
 * @param {Object} statics
 *
 * @private
 */
var defineSubclass = function(superclass, constructor, methods, statics) {
  // set up the prototype object of the subclass
  constructor.prototype = inherit(superclass.prototype);
  constructor.prototype.constructor = constructor;
  // copy the methods and statics as we would for a regular class
  if (methods) extend(constructor.prototype, methods);
  if (statics) extend(constructor, statics);
  // return the class
  return constructor;
};

/**
 * Returns a newly created object that inherits properties from the
 * prototype object p.
 *
 * @param {Object|Function} p
 *
 * @private
 */
var inherit = function(p) {
  // p must be a non-null object
  if (p == null) {
    throw TypeError();
  };
  // if Object.create() is defined, then just use it
  if (Object.create) {
    return Object.create(p);
  }
  // do some more type checking
  var type = typeof p;
  if (type !== "object" && type !== "function") {
    throw TypeError();
  }
  // define a dummy constructor function
  function f() {};
  // set its prototype property to p
  f.prototype = p;
  // use f() to create an "heir" of p
  return new f();
};
