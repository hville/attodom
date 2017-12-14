var W = require('./window')
var attoKey = require('./atto-key')
var CElement = require('./_c-element')
var CKeyed = require('./_c-keyed')

module.exports = CSelect

/**
 * @constructor
 * @param {!Object} items
 * @param {Function} [select]
 */
function CSelect(items, select) {
	this.refs = items
	if (select) this.select = select

	this.node = W.document.createComment('^')
	this.foot = W.document.createComment('$')
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

	set: CElement.prototype.set,
	wrap: CElement.prototype.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	remove: CKeyed.prototype.remove,
	moveTo: CKeyed.prototype.moveTo,
	_placeItem: CKeyed.prototype._placeItem,
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
