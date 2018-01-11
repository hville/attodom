var CElement = require('./src/_c-element')
var CNode = require('./src/_c-node')

/**
 * @function component
 * @param {!Node} node
 * @return {!Object} Component
 */
module.exports = function component(node) {
	return node.nodeType === 1 ? new CElement(node) : new CNode(node)
}
