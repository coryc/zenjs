/*!
 * ZenJS
 * Copyright(c) 2013 Cory Caines <me@corycaines.com>
 * MIT Licensed
 */

/**
 * Tags Class
 * Builds the js source for each tag
 */

var util = require ('../util');

// Expose the Tag Class 
exports = module.exports = Tags;

/**
 * Main Tag Class
 *
 */
function Tags() {
	log('here in tags');
}
Tags.fn = Tags.prototype;


/**
 * Get the tag result
 */
Tags.fn.get = function(name){
	log('getting tag: '+name)
};


