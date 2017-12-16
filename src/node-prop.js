/**
 * @param  {string} key
 * @param  {*} [val]
 * @return {!Object}
 */
module.exports = function(key, val) {
	//@ts-ignore
	this.node[key] = val
	return this
}
