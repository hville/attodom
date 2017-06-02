import {D} from './document'
import {attoKey} from './atto-key'
import {CElementProto} from './_c-element'

/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
export function CKeyed(factory, getKey) {
	this.refs = Object.create(null)
	this.factory = factory
	if (getKey) this.getKey = getKey

	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[attoKey] = this
	this.foot[attoKey] = this
}

export var CKeyedProto = CKeyed.prototype = {
	constructor: CKeyed,
	set: CElementProto.set,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	remove: remove,
	foot: null,


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

	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},

	update: updateKeyedChildren,
	updateChildren: updateKeyedChildren,
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
		while (spot !== this.foot) {
			var item = spot[attoKey]
			spot = (item.foot || item.node).nextSibling
			item.remove()
		}
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			refs = Object.create(null)
	if (!parent) throw Error('list update requires a parent node')
	for (var i = 0; i < arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				item = refs[key] = items[key] || this.factory(key, arr[i], i, arr)
		// place before update since lists require a parent before update
		spot = this._placeItem(parent, item, spot, foot).nextSibling
		if (item.update) item.update(arr[i], i, arr)
	}
	this.refs = refs

	while (spot !== this.foot) {
		item = spot[attoKey]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}

	return this
}
