var common = require('../config'),
		thisAssign = require('./this-assign'),
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
	node[common.key] = this
}

var CNproto = CNode.prototype
CNproto.c = thisAssign
CNproto.remove = remove
CNproto.moveTo = move
CNproto.p = prop

/**
* @param  {string|number} txt
* @return {!Object}
*/
CNproto.update = function(txt) {
	this.node.textContent = txt
	return this
}
