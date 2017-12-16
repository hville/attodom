/**
* @param  {string} key
* @param  {*} [val]
* @return {!Object}
*/
module.exports = function(key, val) {
	this[key] = val
	return this
}
