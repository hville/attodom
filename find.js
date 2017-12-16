var common = require('./config')

module.exports = function find(start, test, until) { //find(test, head=body, foot=null)
	var spot = start.node || start,
			last = until ? (until.node || until.foot || until) : null,
			comp = spot[common.key]

	while(!comp || (test && !test(comp))) {
		if (spot === last) return null // specified end reached

		var next = spot.firstChild
		// if no child get sibling, if no sibling, retry with parent
		if (!next) while(!(next = spot.nextSibling)) {
			spot = spot.parentNode
			if (spot === null) return null // end of tree reached
		}
		spot = next
		comp = spot[common.key]
	}
	return comp
}
