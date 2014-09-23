/**
 * This module is a log4js wrapper.
 *
 * @author Bobby Tang
 * @see https://github.com/nomiddlename/log4js-node
 */

var log4js = require('log4js');
var path = require('path');

/**
 * @param {String} category This will be displayed in the console log as a fileName
 *
 * @public
 */
exports.getLogger = function(category) {
  if (typeof category === 'string') {
    category = path.basename(category);
  } else {
    category = 'uncategorized';
  };

  var logger = log4js.getLogger(category);
  return logger;
};

/**
 *
 * @public
 */
exports.getLib = function() {
  return log4js;
};
