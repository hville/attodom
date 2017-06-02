import {D} from './document'
import {attoKey} from './atto-key'
import {CElementProto} from './_c-element'
import {CKeyedProto} from './_c-keyed'

/**
 * @constructor
 * @param {!Object} items
 * @param {Function} [select]
 */
export function CSelect(items, select) {
	this.refs = items
	if (select) this.select = select

	this.node = D.createComment('^')
	this.foot = D.createComment('$')
	this.node[attoKey] = this
	this.foot[attoKey] = this
}

CSelect.prototype = {
	constructor: CSelect,

/**
 * select all by default
 * @function
 * @param {...*} [v]
 * @return {!Array}
 */
	select: function (v) { //eslint-disable-line no-unused-vars
		return Object.keys(this.refs)
	},

	set: CElementProto.set,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	foot: null,
	remove: CKeyedProto.remove,
	moveTo: CKeyedProto.moveTo,
	_placeItem: CKeyedProto._placeItem,
	update: updateSelectChildren,
	updateChildren: updateSelectChildren
}

function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o)
	if (!parent) throw Error('select update requires a parent node')
	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]]
		if (item) {
			// place before update since lists require a parent before update
			spot = this._placeItem(parent, item, spot, foot).nextSibling
			if (item.update) item.update(v,k,o)
		}
	}
	while (spot !== this.foot) {
		item = spot[attoKey]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}
	return this
}
