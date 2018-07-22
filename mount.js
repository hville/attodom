var core = require('./core')

/**
 * @param {Element} kin
 * @param {*} kid
 * @return {Node}
 */
module.exports = function mount(kin, kid) {
	if (kid == null) return null
	if (Array.isArray(kid)) {
		for (var i=0, node; i<kid.length; ++i) node = mount(kin, kid[i])
		return node
	}
	var typ = kid.nodeType
	if (typ) {
		if (typ === 8) {
			//list node
			var list = kid._$lK
			if (list) {
				kin.appendChild(kid)
				return kin.appendChild(list.tail)
			}
		}
		//normal node
		return kin.appendChild(kid)
	}
	return kin.appendChild(core.document.createTextNode(''+kid))
}
