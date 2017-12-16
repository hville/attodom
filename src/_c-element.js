var common = require('../config'),
		thisAssign = require('./this-assign'),
		move = require('./node-move'),
		remove = require('./node-remove'),
		prop = require('./node-prop')

module.exports = CElement

/**
 * @constructor
 * @param {!Node} node - DOM node
 */
function CElement(node) {
	this.node = node
	node[common.key] = this
}
CElement.prototype = {
	remove: remove,
	moveTo: move,
	p: prop,
	c: thisAssign,

	/**
	* @param  {!Object|string} key
	* @param  {*} [val]
	* @return {!Object}
	*/
	a: function(key, val) {
		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},

	append: function() {
		var node = this.node
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child === undefined) throw Error('undefined child')
			if (child !== null) {
				if (Array.isArray(child)) this.append.apply(this, child)
				else if (child.moveTo) child.moveTo(node)
				else node.appendChild(child.nodeType ? child : common.document.createTextNode(''+child))
			}
		}
		return this
	},

	update: updateChildren,
	updateChildren: updateChildren,
	// EVENT LISTENERS

	handleEvent: function(event) {
		var handlers = this.handlers,
				handler = handlers && handlers[event.type]
		if (handler) handler.call(this, event)
		else throw Error(event.type + ' handler mismatch')
	},

	on: function(type, handler) {
		if (!handler) {
			if (this.handlers && this.handlers[type]) {
				delete this.handlers[type]
				this.node.removeEventListener(type, this, false)
			}
		}
		else {
			if (!this.handlers) this.handlers = {}
			this.handlers[type] = handler
			this.node.addEventListener(type, this, false)
		}
		return this
	}
}
function updateChildren(v, k, o) {
	var child = this.node.firstChild
	while (child) {
		var co = child[common.key]
		if (co) {
			if (co.update) co.update(v, k, o)
			child = (co.foot || child).nextSibling
		}
		else child = child.nextSibling
	}
	return this
}
