/**
 * @return {!Object} this
 */
module.exports = function() {
	//@ts-ignore
	var node = this.node,
			origin = node.parentNode
	if (origin) origin.removeChild(node)
	return this
}
