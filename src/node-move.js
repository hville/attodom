/**
* @param  {!Node} parent destination parent
* @param  {Node} [before] nextSibling
* @return {!Object} this
*/
module.exports = function(parent, before) {
	//@ts-ignore
	var node = this.node,
			anchor = before || null
	if (!parent) throw Error('invalid parent node')

	if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
		parent.insertBefore(node, anchor)
	}
	return this
}
