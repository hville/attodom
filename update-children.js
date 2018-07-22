var update = require('./update')

/**
 * @param {Element} kin
 * @param {*} val
 * @param {String|Number} key
 * @param {*} obj
 * @return {Element}
 */
module.exports = function(kin, val, key, obj) {
	var spot = kin.firstChild
	while ((spot = update(spot, val, key, obj).nextSibling));
	return kin
}
