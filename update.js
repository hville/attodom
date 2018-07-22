/**
 * @param {Node} kin
 * @param {*} [val]
 * @param {String|Number} [key]
 * @param {*} [obj]
 * @return {Node}
 */
module.exports = function(kin, val, key, obj) {
	//@ts-ignore
	var updt = kin._$uK
	return updt && updt(kin, val, key, obj) || kin
}
