/**
 * Log
 * shortens console.log to log
 */
exports = module.exports = log;
function log(){
	console.log.apply(this,arguments);
}