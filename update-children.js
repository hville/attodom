/**
 * @this {Element}
 * @param {*} val
 * @param {String|Number} key
 * @param {*} obj
 * @return {void}
 */
module.exports = function(val, key, obj) {
	//@ts-ignore
	var spot = this.firstChild
	while (spot) spot = (spot.update && spot.update(val, key, obj) || spot).nextSibling
}
