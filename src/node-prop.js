/**
 * @param  {string} key
 * @param  {*} [val]
 * @return {!Object}
 */
module.exports = function(key, val) {
	this.node[key] = val
	return this
}
