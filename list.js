/**
 * @param {!Function} factory
 * @param {Function} [getKey]
 * @return {List}
 */
module.exports = function(factory, getKey) {
	return new List(factory, getKey)
}

/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
function List(factory, getKey) {
	this.kids = Object.create(null) //TODO
	this.factory = factory
	if (getKey) this.getKey = getKey
}

List.prototype.head =
List.prototype.foot = null

List.prototype.getKey = function(v,i) {
	return i // default: indexed
}
