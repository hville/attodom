var attoKey = require('./atto-key')
var CElement = require('./_c-element')

module.exports = CNode

/**
 * @constructor
 * @param {Node} node - DOM node
 */
function CNode(node) {
	this.node = node
	node[attoKey] = this
}

CNode.prototype = {
	constructor: CNode,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },
	p: CElement.prototype.p,
	wrap: CElement.prototype.wrap,
	set: CElement.prototype.set,
	moveTo: CElement.prototype.moveTo,
	remove: CElement.prototype.remove,
	text: CElement.prototype.text,
	update: CElement.prototype.text
}
