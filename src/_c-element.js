var W = require('./window')
var attoKey = require('./atto-key')

module.exports = CElement

/**
 * @constructor
 * @param {!Node} node - DOM node
 */
function CElement(node) {
	this.node = node
	node[attoKey] = this
}

CElement.prototype = {
	constructor: CElement,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },

	wrap: function(name, action) {
		var method = this.constructor.prototype[name],
				arity = method.length,
				async = (action.length === arity + 1)

		this[name] = function() {
			var len = arguments.length,
					args = Array(arity)

			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null
			if (async) {
				var ctx = this
				action.apply(this, args.concat(function() {
					if (arguments.length) throw Error('callback takes no argument')
					method.apply(ctx, args)
				}))
			}
			else {
				action.apply(this, args)
				method.apply(this, args)
			}
			return this
		}

		return this
	},

	/**
	* @function
	* @param  {!Node} parent destination parent
	* @param  {Node} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				anchor = before || null
		if (!parent) throw Error('invalid parent node')

		if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			parent.insertBefore(node, anchor)
		}
		return this
	},

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode
		if (origin) origin.removeChild(node)
		return this
	},

	/**
	 * @function
	 * @param {string|number} key
	 * @param {*} val value
	 * @returns {!Object} this
	 */
	set: function(key, val) {
		this[key] = val
		return this
	},

	p: function(key, val) {
		this.node[key] = val
		return this
	},

	text: function(txt) {
		this.node.textContent = txt
		return this
	},

	a: function(key, val) {
		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},

	id: function(id) {
		this.node.setAttribute('id', id)
		return this
	},

	class: function(val) {
		this.node.setAttribute('class', val)
		return this
	},

	child: function() {
		var node = this.node
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child === undefined) throw Error('undefined child')
			if (child !== null) {
				if (Array.isArray(child)) this.child.apply(this, child)
				else if (child.moveTo) child.moveTo(node)
				else node.appendChild(child.nodeType ? child : W.document.createTextNode(''+child))
			}
		}
		return this
	},

	// EVENT LISTENERS
	handlers: null,
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
	},

	update: updateChildren,
	updateChildren: updateChildren
}

function updateChildren(v, k, o) {
	var child = this.node.firstChild
	while (child) {
		var co = child[attoKey]
		if (co) {
			if (co.update) co.update(v, k, o)
			child = (co.foot || child).nextSibling
		}
		else child = child.nextSibling
	}
	return this
}
