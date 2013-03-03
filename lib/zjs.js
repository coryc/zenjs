/*!
 * ZenJS
 * Copyright(c) 2013 Cory Caines <me@corycaines.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path'), 
	basename = path.basename,
	dirname = path.dirname,
	extname = path.extname,
	join = path.join,
	fs = require('fs'),
	file = fs.readFileSync;


/**
 * Render the ZJS source
 */
exports.render = function(str, options){
	return str;
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

  	var key = path + ':string';

  	if ('function' == typeof options) {
  	  fn = options, options = {};
  	}
  	options.filename = path;
  	try {
  		// *todo add cache load
    	var src = read(path, 'utf8');
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