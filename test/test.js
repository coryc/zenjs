/**
 * Testing parser concepts
 * very rough outline
 */

var fs = require('fs'),
	file = fs.readFileSync;

/* should move to a shared lib or util file */
// remove leading and trailing
function trim(str, c) {
	if(!c) return str;
	if (c == " ") c = "\\s";
	return str.replace(new RegExp('^'+c+'+|'+c+'+$', 'g'), '');
}

var Parser = function (src){

	// Tag Tokens
	var open = '<z:';
	var close = '</z:';
	var end = '>';
	var self_end = '/>';

	// Regular Expressions
	var zjsOpenTag = /^<z:([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/ , 
		zjsCloseTag = /^<\/z:([-A-Za-z0-9_]+)[^>]*>/,
		htmlAttr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/,
		inlineCss = /([\w-]+)\s*:\s*([^;]+)\s*;?/;

	/**
	 * Preserve newlines and tabs
	 * other whitespace characted should be supported
	 */
	this.escape = function(str){
	  return String(str)
	  			.replace(/[\t]/g, "\\t")
			    .replace(/[\n]/g, "\\n");
	};

	this.parse = function(src) {
			
		var index, _src = src, last = src, stack = [], output;

		while (_src) {

			// Open tag
			if (_src.indexOf(open) == 0) {
				var tag = _src.match(zjsOpenTag);

				if (tag) {
					//parse the tag
					var result = this.parseTag(tag);
					// adjust the source	
					_src = _src.substring(tag[0].length);

					// add the result to the stack
					stack.push(result);
				}
			} else {
				
				// find the closest tag token
				var index;
				var io = _src.indexOf(open);
				var ic = _src.indexOf(close);

				if (io == ic) {
					index = io;
				} else {
					index = Math.min(io, ic);
					index = index < 0 ? Math.max(io, ic) : index;
				}

				// parse out the text chunk and trim the src buffer
				var str = index < 0 ? _src : _src.substring(0, index);
					_src = index < 0 ? '' : _src.substring(index);

				stack.push('__buf.push(\''+this.escape(str)+'\');');
			}

			// Make sure the last src doesnt match the current one
			// this mean that no match was found, and prevents
			// infinate loops
			if (_src == last) {
				console.log('Parser Error, no matches could be found');
				break;
			}
			last = _src;
		}

	
		output = stack.join('');
		return output;
	}

	// Compile File
	// compile the parse result into an callable function
	this.compile = function(src){

		// get the parsed template src
		var _src = this.parse(src);

		// add the source header
		// include internals, stack tracing ...

		var src = [
			'var __buf = [];',
			'with(data || {}){',
				_src,	
			'}',
			'return __buf.join("");'
		].join('\n');

		// Create a new callable template function
		var fn = new Function('data', src);
		var exe = function(data){
			return fn.call(this, data);
		}
		return exe;
	}

	/**
	 *	Tags parsing
	 *  *** there could be a better way
	 */

	this.parseTag = function(tag) {

		var tag_name = tag[1];
		var attr_str = tag[2];
		// Parse attributes
		attr_str = trim(attr_str, " ");
		attr = this.parseAttr(attr_str);

		// Main Tag Switch
		switch (tag_name.toLowerCase()) {
			case 'var':
				return this.parseVarTag(attr);
			case 'set':
				return this.parseSetTag(attr);
			default:
				return false;
		}
	}

	/**
	 * Parse attributes 
	 * turn attr string into an object
	 */

	this.parseAttr = function(str) {
		var attr = {};
		
		var parts = str.split(" ");
		parts = parts.length == 1 ? [str] : parts;
		for(var i = 0; i <= parts.length-1; i++) {
			var _attr = parts[i].match(htmlAttr);
			if(_attr || _attr[1] ) {
				attr[_attr[1]] = (_attr[2] ? _attr[2] : null);
			}	
		}
				
		return attr;
	}

	/**
	 * Parse Var
	 */
	this.parseVarTag = function(attr) {
		if (attr.name)
			return this.print_var(attr.name);
		return false;
	}

	/**
	 * Set tag
	 * worsk as an assignment operator
	 */
	this.parseSetTag = function(attr){
		if(attr.name) {
			var src = attr.name;
			if(attr.value) {
				src+=' = '+( isNaN(attr.value) ? "'"+attr.value+"';" : attr.value )	
			}
			src+=';';
			return src;
		}
		
		return false;
	}
	
	/** 
   	 * Print helper function
   	 */
	this.print = function(str){
		return '__buf.push('+str+');';
	}
	this.print_var = function(v) {
		return '__buf.push(('+v+'));';
	}
	this.print_str = function(str){
		return '__buf.push(\''+this.escape(str)+'\');';
	}
}
	
var src = file('./test/views/test.zjs', 'utf8');
var parser = new Parser();
var fn = parser.compile(src);

console.log('\n ==========================\nResult: \n'+fn.call(null, {name:'Cory', tester: 'test'}));
