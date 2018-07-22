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
	if (kid.constructor === String) return kin.appendChild(core.document.createTextNode(kid))
	if (kid.constructor === Number) return kin.appendChild(core.document.createTextNode(''+kid))
	if (kid.nodeType === 8) {
		var list = kid._$lK
		if (list) {
			kin.appendChild(kid)
			return kin.appendChild(list.tail)
		}
	}
	if (kid.nodeType) return kin.appendChild(kid)

	throw Error('invalid child')
}
