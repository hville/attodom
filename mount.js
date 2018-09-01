/* global document */
/**
 * @param {Element} kin
 * @param {*} kid
 * @return {void}
 */
module.exports = function mount(kin, kid) {
	if (kid != null) {
		if (Array.isArray(kid)) {
			for (var i=0; i<kid.length; ++i) mount(kin, kid[i])
		}
		else if (kid.nodeType) {
			kin.appendChild(kid)
			if (kid.nodeType === 8 && kid._$lK) kin.appendChild(kid._$lK.tail)
		}
		else kin.appendChild(document.createTextNode(kid))
	}
}
