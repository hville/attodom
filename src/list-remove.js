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
			var next = spot.nextSibling
			origin.removeChild(spot)
			spot = next
		}
		//@ts-ignore
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}
