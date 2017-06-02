import {D} from './document'
import {CElement} from './_c-element'
import {CNode} from './_c-node'
import {CKeyed} from './_c-keyed'
import {CSelect} from './_c-select'
import {attoKey} from './atto-key'

var svgURI = 'http://www.w3.org/2000/svg'

/**
 * @function svg
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
export function svg(tag) {
	return new CElement(D.createElementNS(svgURI, tag))
}

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
export function element(tagName) {
	return new CElement(D.createElement(tagName))
}

/**
 * @function elementNS
 * @param {!string} nsURI namespace URI
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
export function elementNS(nsURI, tag) {
	return new CElement(D.createElementNS(nsURI, tag))
}

/**
 * @function text
 * @param {!string} txt textContent
 * @return {!Object} Component
 */
export function text(txt) {
	return new CNode(D.createTextNode(txt))
}

/**
 * @function component
 * @param {!Node} node
 * @return {!Object} Component
 */
export function component(node) {
	// destroy existing component if any
	if (node[attoKey]) node[attoKey].node = null
	return node.nodeType === 1 ? new CElement(node) : new CNode(node)
}

/**
 * @function fragment
 * @return {!Object} Component
 */
export function fragment() {
	return new CNode(D.createDocumentFragment())
}

/**
 * @function
 * @param {!Function} factory
 * @param {Function} [getKey]
 * @return {!Object} Component
 */
export function list(factory, getKey) {
	return new CKeyed(factory, getKey)
}

/**
 * @function
 * @param {!Object|!Array} items
 * @param {Function} [getKeys]
 * @return {!Object} Component
 */
export function select(items, getKeys) {
	return new CSelect(items, getKeys)
}
