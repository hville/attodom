import {D} from './document'
import {attoKey} from './atto-key'

/**
 * @constructor
 * @param {Element} node - DOM node
 */
export function CElement(node) {
	this.node = node
	node[attoKey] = this
}

export var CElementProto = CElement.prototype = {
	constructor: CElement,
	_handlers: null,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },

	wrap: function(name, action) {
		var method = this[name],
				arity = method.length

		var async = false
		if (action.length === arity + 1) async = true
		else if (action.length !== arity) throw Error(name + 'wrapper arity mimatch')

		this[name] = function() {
			var len = arguments.length,
					args = Array(arity)
			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null
			if (async) {
				args.push(method.bind(this))
				action.apply(this, args)
			}
			else {
				action.apply(this, args)
				method.apply(this, args)
			}
			return this
		}
		return this
	},

	wrapAsync: function (name, action) {
		var method = this[name],
				arity = method.length
		if (action.length !== arity + 1) throw Error(name + 'async wrapper arity mimatch')
		this[name] = function () {
			var len = arguments.length,
					args = Array(arity)
			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null
			action.apply(this, args)
			return method.apply(this, args)
		}
		return this
	},

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
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

	destroy: function() {
		this.remove()
		if (this._handlers) for (var i=0, ks=Object.keys(this._handlers); i<ks.length; ++i) this.on(ks[i], false)
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

	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val
		return this
	},

	text: function(txt) {
		this.node.textContent = txt
		return this
	},

	attr: function(key, val) {
		if (val === false) this.node.removeAttribute(key)
		else this.node.setAttribute(key, val === true ? '' : val)
		return this
	},

	class: function(val) {
		this.node.setAttribute('class', val)
		return this
	},

	child: function(child) {
		var node = this.node
		if (child != null) {
			if (Array.isArray(child)) child.forEach(this.child, this)
			else if (child.moveTo) child.moveTo(node)
			else node.appendChild(
				child.cloneNode ? child.cloneNode(true) : D.createTextNode(''+child)
			)
		}
		return this
	},

	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._handlers,
				handler = handlers && handlers[event.type]
		if (handler) handler.call(this, event)
	},

	on: function(type, handler) {
		if (!handler) {
			if (this._handlers && this._handlers[type]) {
				delete this._handlers[type]
				this.node.removeEventListener(type, this, false)
			}
		}
		else {
			if (!this._handlers) this._handlers = {}
			this._handlers[type] = handler
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
