import {D} from './document'
import {attoKey} from './atto-key'
import {CElementProto} from './_c-element'
import {CKeyedProto} from './_c-keyed'


/**
 * @constructor
 * @param {!Object} items
 * @param {Function} [select]
 */
export function CSelect(items, select) { //TODO list config vs template config
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
	remove: CKeyedProto.remove,
	destroy: CKeyedProto.remove,
	moveTo: CKeyedProto.moveTo,
	_placeItem: CKeyedProto._placeItem,
	update: updateSelectChildren,
	updateChildren: updateSelectChildren
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
