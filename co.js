var root = require('./root'),
		mount = require('./mount')

/**
 * @param {Element} node
 * @return {Component}
 */
module.exports = function(node) {
	var comp = new Component(node),
			open = null,
			last = null
	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (arg.constructor && arg.constructor !== Object) {
				// append
				if (!comp.kids) comp.kids = []
				if (arg.factory && arg.getKey) {
					// append list
					if (open) {
						open.foot = last = comp.node.appendChild(root.document.createComment('<>'))
						open = null
					}
					if (last) arg.head = last
					comp.kids.push(open = arg)
				}
				else {
					// append child
					last = mount(comp, arg)
					if (open) {
						open.foot = last
						open = null
					}
					//if (arg.node) comp.kids.push(arg)
				}
			}
			// decorate
			else for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j]
				if (key[0] === 'o' && key[1] === 'n') comp.on(key.slice(2), arg[ks[j]])
				else comp[ks[j]] = arg[ks[j]]
			}
		}
	}
	if (!comp.update) {
		comp.update = comp.kids ? comp.updateChildren : comp.node.nodeName === 'INPUT' ? comp.setValue : comp.setText
	}
	return comp
}

/**
 * @constructor
 * @param {!Element} node
 */
function Component(node) {
	this.node = node
	this.update = null
}



Component.prototype.kids =
Component.prototype.handlers = null

Component.prototype.handleEvent = function(event) {
	var handlers = this.handlers,
			handler = handlers && handlers[event.type]
	if (handler) handler.call(this, event)
	else throw Error(event.type + ' handler mismatch')
}

Component.prototype.on = function(type, handler) {
	if (!handler) {
		if (this.handlers && this.handlers[type]) {
			delete this.handlers[type]
			this.node.removeEventListener(type, this, false)
		}
	}
	else {
		if (!this.handlers) this.handlers = Object.create(null) //TODO Map?
		this.handlers[type] = handler
		this.node.addEventListener(type, this, false)
	}
	return this
}

Component.prototype.updateChildren = function(v,k,o) {
	var kids = this.kids
	//if (kids) for (var i=0; i<kids.length; ++i) kids[i].update(v,k,o)
	if (kids) for (var i=0; i<kids.length; ++i) kids[i].factory ? this.updateList(kids[i], v) : kids[i].update(v,k,o)
	return this
}

Component.prototype.setValue = function(v) {
	//@ts-ignore
	this.node.value = v
	return this
}

Component.prototype.setText = function(t) {
	this.node.textContent = t
	return this
}

Component.prototype.updateList = function(list, arr) {
	var node = this.node,
			spot = list.head ? list.head.nextSibling : node.firstChild,
			kids = Object.create(null) //TODO

	for (var i = 0; i < arr.length; ++i) {
		var key = list.getKey(arr[i], i, arr),
				comp = list.kids[key]
		if (!comp) comp = list.factory(arr[i], i, arr)
		else if (comp.update) comp.update(arr[i], i, arr)
		kids[key] = comp
		var item = comp.node

		if (!spot) node.appendChild(item)
		else if (item === spot.nextSibling) node.insertBefore(spot, list.foot)
		else if (item !== spot) node.insertBefore(item, spot)
		spot = item.nextSibling
	}

	while (spot !== list.foot) {
		console.log(spot, list.foot)
		var next = spot.nextSibling
		node.removeChild(spot)
		spot = next
	}
	list.kids = kids
	return this
}
