/*!
 * ZenJS
 * Copyright(c) 2013 Cory Caines <me@corycaines.com>
 * MIT Licensed
 */

/**
 * Parser Class
 */

// Tags
var tags = require('./parser/tags'),
	util = require('./util');

/**
 * Expose Parser
 */
exports = module.exports = createParser;


/**
 * Create Parser Object
 */
function createParser(src, options){
	var parser = new Parser(src, options);
	return parser;
}

/**
 * Main Parser Class
 */
var Parser = function(src, options) {
	this.src = src;
	this.options = options || {}
}

Parser.fn = Parser.prototype;

/**
 * Set source
 */
Parser.fn.setSrc = function(src){
	if(src)
		this.src = src;
	return this;
}

/**
 * Get source
 */
Parser.fn.getSrc = function(){
	return this.src;
}

/**
 * Run the parser
 */
Parser.fn.run = function() {
	var _tags = new tags();	
	_tags.get('var');
	return 'In the run function ['+this.getSrc()+']';
}