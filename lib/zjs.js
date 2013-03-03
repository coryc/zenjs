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
	read = fs.readFileSync;

exports.test = function(){
	return 'hello from zjs!';
}