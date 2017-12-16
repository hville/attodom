/**
* @param  {!Object} parent destination parent
* @param  {Object} [before] nextSibling
* @return {!Object} this
*/
module.exports = function(parent, before) {
	//@ts-ignore
	var foot = this.foot,
			//@ts-ignore
			next = this.node,
			origin = next.parentNode,
			anchor = before || null

	if (!parent.nodeType) throw Error('invalid parent node')

	if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

		if (origin) { // relocate
			var cursor
			do next = (cursor = next).nextSibling
			while (parent.insertBefore(cursor, anchor) !== foot)
		}
		else { // insertion
			parent.insertBefore(next, anchor)
			parent.insertBefore(foot, anchor)
		}
	}
	return this
}
