var common = require('./common')
var CElement = require('./src/_c-element')
var CNode = require('./src/_c-node')

/**
 * @function component
 * @param {!Node} node
 * @return {!Object} Component
 */
module.exports = function component(node) {
	// destroy existing component if any
	if (node[common.key]) node[common.key].node = null
	return node.nodeType === 1 ? new CElement(node) : new CNode(node)
}
