/**
 * Modules loader
 *
 * @author Minix Li
 */

var fs = require('fs');
var path = require('path');

/**
 * Load modules under the path
 *
 * @param {String} path
 *
 * @return {Object}
 */
module.exports.load = function(path) {
  if (!path) {
    throw new Error('path should not be empty');
  }

  path = fs.realpathSync(path);

  if (!fs.existsSync(path)) {
    throw new Error('path not exist, path: ' + path);
  }
  if(!isDir(path)) {
    throw new Error('path should be a directory');
  }

  return loadPath(path);
};

/**
 * Load path
 *
 * @param {String} path
 *
 * @return {Object}
 */
var loadPath = function(path) {
  var files = fs.readdirSync(path);
  if(files.length === 0) {
    console.warn('path is empty, path: ' + path);
    return;
  }

  if(path.charAt(path.length - 1) !== '/') {
    path += '/';
  }

  var filepath, filename, module, result = {};
  for(var i = 0, l = files.length; i < l; i++) {
    filename = files[i];
    filepath = path + filename;

    if(!isFile(filepath) || !checkFileType(filename, '.js')) {
      // only load js file type
      continue;
    }

    module = loadFile(filepath);
    if(!module) {
      continue;
    }

    var name = module.name || getFileName(filename, '.js'.length);
    result[name] = module;
  }

  return result;
};

/**
 * Load file
 *
 * @param {String} path
 *
 * @return {Object}
 */
var loadFile = function(path) {
  var module = requireUncached(path);
  if(!module) {
    return;
  }

  if(typeof module === 'function') {
    // if the module provides a factory function
    // then invoke it to get a instance
    module = module();
  }
  return module;
};

/**
 * Check whether a path is a directory
 *
 * @param {String} filepath
 *
 * @return {Boolean}
 */
var isDir = function(filepath) {
  return fs.statSync(filepath).isDirectory();
};

/**
 * Check whether a path is a file
 *
 * @param {String} filepath
 *
 * @return {Boolean}
 */
var isFile = function(filepath) {
  return fs.statSync(filepath).isFile();
};

/**
 * Get file name
 *
 * @param {String} filepath
 * @param {Number} suffixLength
 *
 * @return {String}
 */
var getFileName = function(filepath, suffixLength) {
  var filename = path.basename(filepath);

  if(filename.length > suffixLength) {
    return filename.substring(0, filename.length - suffixLength);
  }
  return filename;
};

/**
 * Check file suffix
 *
 * @param filename {String} filename
 * @param suffix {String} suffix string, such as .js, etc.
 *
 * @return {Boolean}
 */
var checkFileType = function(filename, suffix) {
  if(suffix.charAt(0) !== '.') {
    suffix = '.' + suffix;
  }

  if(filename.length <= suffix.length) {
    return false;
  }

  var str = filename.substring(filename.length - suffix.length);
  return str.toLowerCase() === suffix.toLowerCase();
};

/**
 * Require module uncached
 *
 * @param {String} path
 *
 * @return {Object}
 */
var requireUncached = function(path) {
  delete require.cache[require.resolve(path)];
  return require(path);
};
