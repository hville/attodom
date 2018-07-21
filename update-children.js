var core = require('./core')

/**
 * @param {Element} kin
 * @param {*} val
 * @param {String|Number} key
 * @param {*} obj
 * @return {Element}
 */
module.exports = function(kin, val, key, obj) {
	var spot = kin.firstChild
	while (spot) {
		var updt = core.updaters.get(spot)
		if (updt) updt(spot, val, key, obj)
		spot = spot.nextSibling
	}
	return kin
}
