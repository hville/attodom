var common = require('../common'),
		thisAssign = require('./this-assign')

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
CNproto.assign = thisAssign


/**
* @return {!Object} this
*/
CNproto.remove = function() {
	var node = this.node,
			origin = node.parentNode
	if (origin) origin.removeChild(node)
	return this
}

/**
* @param  {!Node} parent destination parent
* @param  {Node} [before] nextSibling
* @return {!Object} this
*/
CNproto.moveTo = function(parent, before) {
	var node = this.node,
			anchor = before || null
	if (!parent) throw Error('invalid parent node')

	if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
		parent.insertBefore(node, anchor)
	}
	return this
}

/**
* @param  {!Object|string} key
* @param  {*} [val]
* @return {!Object}
*/
CNproto.prop = function(key, val) {
	if (typeof key === 'object')
		for (var i=0, ks=Object.keys(key); i<ks.length; ++i)
			this.node[ks[i]] = key[ks[i]]
	else this.node[key] = val
	return this
}

/**
* @param  {string|number} txt
* @return {!Object}
*/
CNproto.update = function(txt) {
	this.node.textContent = txt
	return this
}
