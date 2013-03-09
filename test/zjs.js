/**
 * Test zjs template engine
 */

var zjs = require('..');
	util = require('../lib/util');

// render a string
/* 
zjs.renderFile('./test/views/view.zjs', {}, function(err, result){
	console.log(result);	
});
*/

log(zjs.parse('blahblah'));