import {D} from './document'
import {CElement} from './_c-element'
import {CNode} from './_c-node'
import {CList} from './_c-list'

var svgURI = 'http://www.w3.org/2000/svg'


/**
 * @function svg
 * @param {string} tag tagName
 * @return {!Object} Component
 */
export function svg(tag) { //eslint-disable-line no-unused-vars
	return new CElement(D.createElementNS(svgURI, tag))
}


/**
 * @function element
 * @param {string} tagName tagName
 * @return {!Object} Component
 */
export function element(tagName) { //eslint-disable-line no-unused-vars
	return new CElement(D.createElement(tagName))
}

/**
 * @function elementNS
 * @param {string} nsURI namespace URI
 * @param {string} tag tagName
 * @return {!Object} Component
 */
export function elementNS(nsURI, tag) { //eslint-disable-line no-unused-vars
	return new CElement(D.createElementNS(nsURI, tag))
}

/**
 * @function text
 * @param {string} txt textContent
 * @return {!Object} Component
 */
export function text(txt) { //eslint-disable-line no-unused-vars
	return new CNode(D.createTextNode(txt))
}


/**
 * @function list
 * @param {!Function} model model
 * @param {*} [config] model
 * @return {!Object} Component
 */
export function list(model, config) { //eslint-disable-line no-unused-vars
	return new CList(model, config)
}
