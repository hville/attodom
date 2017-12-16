var common = require('./config'),
		placeItem = require('./src/place-item'),
		thisAssign = require('./src/this-assign'),
		move = require('./src/list-move'),
		remove = require('./src/list-remove')

/**
 * @function
 * @param {!Object|!Array} items
 * @param {function([*], [string], [Object]):Array<string>} [getKeys]
 * @return {!Object} Component
 */
module.exports = function select(items, getKeys) {
	return new CSelect(items, getKeys)
}

/**
 * @constructor
 * @param {!Object} items
 * @param {function([*], [string], [Object]):Array<string>} [select]
 */
function CSelect(items, select) {
	this.refs = items
	this.select = select || refsKeys

	this.node = common.document.createComment('^')
	this.foot = common.document.createComment('$')
	this.node[common.key] = this
	this.foot[common.key] = this
}

CSelect.prototype = {
	remove: remove,
	moveTo: move,
	c: thisAssign,
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
			spot = placeItem(parent, item, spot, foot).nextSibling
			if (item.update) item.update(v,k,o)
		}
	}
	while (spot !== this.foot) {
		item = spot[common.key]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}
	return this
}

/**
 * select all by default
 * @function
 * @return {!Array<string>}
 */
function refsKeys() {
	return Object.keys(this.refs)
}
