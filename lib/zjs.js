/*!
 * ZenJS
 * Copyright(c) 2013 Cory Caines <me@corycaines.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var parser = require('./parser'), 
    util = require('./util');
    path = require('path'), 
    basename = path.basename,
    dirname = path.dirname,
    extname = path.extname,
    join = path.join,
    fs = require('fs'),
    file = fs.readFileSync;

/**
 * Parse 
 */
var parse = exports.parse = function(src, options){
  var _parser = parser(src, options);
  return _parser.run();
};

/**
 * Compile
 */
var compile = exports.compile = function(src, options){

};

/**
 * Render the ZJS source
 */
exports.render = function(src, options){
	var fn;
  var options = options || {};

  fn = compile(src, options);
  options.__proto__ = options.data;
}


/**
 * Render ZendJS File given the path, data 
 * and and a callback
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function} err_fn
 */

exports.renderFile = function(path, options, callback) {

	var options = options || {};

  	if ('function' == typeof options) {
  	  callback = options, options = {};
  	}

  	options.filename = path;

  	try {
  		// *todo add cache load
    	var src = file(path, 'utf8');
    	callback(null, exports.render(src, options));
 	} catch (err) {
 		// call the error callback
    	callback(err);
 	}
};

/**
 * Add Hook for express file render
 */
exports.__express = exports.renderFile;