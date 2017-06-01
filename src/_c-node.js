import {CElementProto} from './_c-element'
import {attoKey} from './atto-key'


/**
 * @constructor
 * @param {Node} node - DOM node
 */
export function CNode(node) {
	this.node = node
	node[attoKey] = this
}

CNode.prototype = {
	constructor: CNode,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },
	prop: CElementProto.prop,
	wrap: CElementProto.wrap,
	set: CElementProto.set,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	destroy: CElementProto.remove,
	text: nodeValue,
	update: nodeValue
}

function nodeValue(val) {
	this.node.nodeValue = val
}
