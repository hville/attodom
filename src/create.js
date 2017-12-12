var W = require('./window')
var attoKey = require('./atto-key')
var CElement = require('./_c-element')
var CNode = require('./_c-node')
var CKeyed = require('./_c-keyed')
var CSelect = require('./_c-select')

var svgURI = 'http://www.w3.org/2000/svg'

/**
 * @function svg
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
export function svg(tag) {
	return new CElement(W.document.createElementNS(svgURI, tag))
}

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
export function element(tagName) {
	return new CElement(W.document.createElement(tagName))
}

/**
 * @function elementNS
 * @param {!string} nsURI namespace URI
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
export function elementNS(nsURI, tag) {
	return new CElement(W.document.createElementNS(nsURI, tag))
}

/**
 * @function text
 * @param {!string} txt textContent
 * @return {!Object} Component
 */
export function text(txt) {
	return new CNode(W.document.createTextNode(txt))
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
