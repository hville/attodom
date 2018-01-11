var thisAssign = require('./this-assign'),
		move = require('./node-move'),
		remove = require('./node-remove'),
		prop = require('./node-prop')

module.exports = CNode

/**
 * @constructor
 * @param {Node} node - DOM node
 */
function CNode(node) {
	this.node = node
}

CNode.prototype = {
	c: thisAssign,
	remove: remove,
	moveTo: move,
	p: prop,

	/**
	* @param  {string|number} txt
	* @return {!Object}
	*/
	update: function(txt) {
		this.node.textContent = txt
		return this
	}
}
