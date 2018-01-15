var common = require('./context'),
		Component = require('./component')

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
module.exports = function element(tagName) {
	return new Component(common.document.createElement(tagName))
}

/**
 * @constructor
 * @param {!Node} node - DOM node
 */
function CElement(node) {
	this.node = node
}

CElement.prototype = {

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

	/**
	 * @param  {string} key
	 * @param  {*} [val]
	 * @return {!Object}
	 */
	p: function(key, val) {
		//@ts-ignore
		this.node[key] = val
		return this
	},

	/**
	* @param  {string} key
	* @param  {*} [val]
	* @return {!Object}
	*/
	//TODO ugly
	c: function(key, val) {
		this[key] = val
		return this
	},
	//TODO ugly
	append: function() {
		var node = this.node
		for (var i=0; i<arguments.length; ++i) {
			var child = arguments[i]
			if (child === undefined) throw Error('undefined child')
			if (child !== null) {
				if (Array.isArray(child)) this.append.apply(this, child)
				else {
					node.appendChild(child.node || (child.nodeType ? child : common.document.createTextNode(''+child)))
					//fix footer if list
					if (this.foot === null) this.foot = this.node.lastChild
				}
			}
		}
		return this
	},

	// Event Handlers

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

	// List Parent
	// TODO h(t, a, list(factory, getKey)=>decorator)
	// TODO h('tag', {}, head, factory, getKey, foot)
	// decorator.call(this) || {}
	list: function(factory, getKey) {
		this.head = this.node.lastChild
		this.foot = null
		this.refs = Object.create(null)
		this.factory = factory
		this.getKey = getKey || getIndex
		this.update = this.updateList
		return this
	},

	updateList: function(arr) {
		var node = this.node,
				foot = this.foot,
				spot = this.head ? this.head.nextSibling : node.firstChild,
				refs = Object.create(null)

		if (!this.factory) throw Error('no list defined')

		for (var i = 0; i < arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr),
					comp = refs[key] = this.refs[key] || this.factory(arr[i], i, arr).c('key', key),
					item = comp.node
			if (comp.update) comp.update(arr[i], i, arr)

			if (!spot) node.appendChild(item)
			else if (item === spot.nextSibling) node.insertBefore(spot, foot)
			else if (item !== spot) node.insertBefore(item, spot)
			spot = item.nextSibling
		}

		while (spot !== this.foot) {
			var next = spot.nextSibling
			node.removeChild(spot)
			spot = next
		}

		this.refs = refs
		return this
	}
}

function getIndex(v,i) {
	return i // default: indexed
}
