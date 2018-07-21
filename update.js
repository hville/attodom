var core = require('./core')

/**
 * @param {Node} kin
 * @param {*} val
 * @param {String|Number} key
 * @param {*} obj
 * @return {Node}
 */
module.exports = function(kin, val, key, obj) {
	var updt = core.updaters.get(kin)
	if (updt) updt(kin, val, key, obj)
	return kin
}
