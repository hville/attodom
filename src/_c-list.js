import {D} from './document'
import {attoKey} from './atto-key'
import {CElementProto} from './_c-element'


/**
 * @constructor
 * @param {!Object} template
 * @param {*} [config]
 */
export function CList(template, config) { //TODO list config vs template config
	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.refs = Object.create(null)
	this.node[attoKey] = this
	this.foot[attoKey] = this

	// select list
	if (typeof template === 'object') {
		this.update = this.updateChildren = updateSelectChildren
		for (var i=0, ks=Object.keys(template); i<ks.length; ++i) {
			var key = ks[i]
			this.refs[key] = template[key].node ? template[key] : template[key].call(this, config, key)
		}
	}
	//keyed
	else {
		this.template = template
		this.update = this.updateChildren
		this.config = config
	}
}

CList.prototype = {
	constructor: CList,
	getParent: CElementProto.getParent,
	extra: CElementProto.extra,
	prop: CElementProto.prop,
	remove: remove,
	destroy: remove,


	/**
	* @function moveTo
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				anchor = before || null

		if (!parent.nodeType) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

			if (origin) { // relocate
				var cursor
				do next = (cursor = next).nextSibling
				while (parent.insertBefore(cursor, anchor) !== foot)
			}
			else { // insertion
				parent.insertBefore(next, anchor)
				parent.insertBefore(foot, anchor)
			}
		}
		return this
	},

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent)
		else if (item.node === spot.nextSibling) spot[attoKey].moveTo(parent, foot)
		else if (item.node !== spot) item.moveTo(parent, spot)
		return item.foot || item.node
	},

	// FOR KEYED LIST
	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},

	updateChildren: function updateKeyedChildren(arr) {
		var foot = this.foot,
				parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
				spot = this.node.nextSibling,
				items = this.refs,
				refs = Object.create(null)

		for (var i=0; i<arr.length; ++i) {
			var key = this.getKey(arr[i], i, arr),
					item = refs[key] = items[key] || this.template(this.config)
			if (item.update) item.update(arr[i], i, arr)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
		this.refs = refs

		if (spot !== this.foot) do {
			item = foot.previousSibling[attoKey]
			item.destroy()
		} while (item !== spot[attoKey])

		return this
	},

	// FOR SELECT LIST
	/**
	 * select all by default
	 * @function
	 * @param {...*} [v]
	 * @return {!Array}
	 */
	select: function(v) { return Object.keys(this.refs) } //eslint-disable-line no-unused-vars
}


function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o)

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			if (item.update) item.update(v,k,o)
			spot = this._placeItem(parent, item, spot, foot).nextSibling
		}
	}
	if (spot !== this.foot) do {
		item = this.foot.previousSibling[attoKey]
		item.destroy()
	} while (item !== spot[attoKey])
	return this
}

/**
* @function remove
* @return {!Object} this
*/
function remove() {
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling

	if (origin) {
		if (spot !== this.foot) do {
			var item = this.foot.previousSibling[attoKey]
			item.destroy()
		} while (item !== spot[attoKey])
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}
