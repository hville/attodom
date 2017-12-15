var common = require('../common'),
		CElement = require('./_c-element')

module.exports = CNode

/**
 * @constructor
 * @param {Node} node - DOM node
 */
function CNode(node) {
	this.node = node
	node[common.key] = this
}

CNode.prototype = {
	constructor: CNode,
	foot: null,
	p: CElement.prototype.p,
	set: CElement.prototype.set,
	moveTo: CElement.prototype.moveTo,
	remove: CElement.prototype.remove,
	text: CElement.prototype.text,
	update: CElement.prototype.text
}
