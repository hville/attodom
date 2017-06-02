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
	p: CElementProto.p,
	wrap: CElementProto.wrap,
	set: CElementProto.set,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	text: CElementProto.text,
	update: CElementProto.text
}
