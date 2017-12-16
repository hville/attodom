var common = require('../config')
/**
* @return {!Object} this
*/
module.exports = function() {
	//@ts-ignore
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling

	if (origin) {
		//@ts-ignore
		while (spot !== this.foot) {
			var item = spot[common.key]
			spot = (item.foot || item.node).nextSibling
			item.remove()
		}
		//@ts-ignore
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}
