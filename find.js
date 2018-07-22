module.exports = function find(start, test, until) { //find(test, head=body, foot=null)
	var spot = start,
			last = until || null
	while(!test(spot)) {
		if (spot === last) return null // specified end reached
		var next = spot.firstChild
		// if no child get sibling, if no sibling, retry with parent
		if (!next) while(!(next = spot.nextSibling)) {
			spot = spot.parentNode
			if (spot === null) return null // end of tree reached
		}
		spot = next
	}
	return spot
}
