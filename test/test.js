/**
 * Testing parser concepts
 * very rough outline
 */

var fs = require('fs'),
	file = fs.readFileSync;

var Parser = function (src){

	// Tag Tokens
	var open = '<z:';
	var close = '</z:';
	var end = '>';
	var self_end = '/>';

	// Regular Expressions
	var zjsOpenTag = /^<z:([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/ , 
		zjsCloseTag = /^<\/z:([-A-Za-z0-9_]+)[^>]*>/,
		htmlAttr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
		inlineCss = /([\w-]+)\s*:\s*([^;]+)\s*;?/;

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
				var match = _src.match(zjsOpenTag);

				if (match) {
					console.log(match);
					_src = _src.substring(match[0].length);
					stack.push('__buf.push(\'test\');');
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

}
	
var src = file('./test/views/test.zjs', 'utf8');
var parser = new Parser();
var fn = parser.compile(src);

//console.log(fn.call());