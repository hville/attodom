var common = require('../config'),
		placeItem = require('./place-item'),
		thisAssign = require('./this-assign')

module.exports = CKeyed

/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
function CKeyed(factory, getKey) {
	this.refs = Object.create(null)
	this.factory = factory
	this.getKey = getKey || getIndex

	this.node = common.document.createComment('^')
	this.foot = common.document.createComment('$')
	this.node[common.key] = this
	this.foot[common.key] = this
}

var CKproto = CKeyed.prototype

CKproto.c = thisAssign

/**
* @return {!Object} this
*/
CKproto.remove = function() {
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling

	if (origin) {
		while (spot !== this.foot) {
			var item = spot[common.key]
			spot = (item.foot || item.node).nextSibling
			item.remove()
		}
		origin.removeChild(this.foot)
		origin.removeChild(head)
	}

	return this
}

/**
* @param  {!Object} parent destination parent
* @param  {Object} [before] nextSibling
* @return {!Object} this
*/
CKproto.moveTo = function(parent, before) {
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
}

CKproto.update = CKproto.updateKeyedChildren = function(arr) {
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
		spot = placeItem(parent, item, spot, foot).nextSibling
		if (item.update) item.update(arr[i], i, arr)
	}
	this.refs = refs

	while (spot !== this.foot) {
		item = spot[common.key]
		spot = (item.foot || item.node).nextSibling
		item.remove()
	}

	return this
}

function getIndex(v,i) {
	return i // default: indexed
}
