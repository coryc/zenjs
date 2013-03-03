/**
 * Test zjs template engine
 */

var zjs = require('..');


// render a string
zjs.renderFile('./test/views/view.zjs', {}, function(err, result){
	console.log(result);	
});
