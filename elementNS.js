var common = require('./config')
var CElement = require('./src/_c-element')

/**
 * @function elementNS
 * @param {!string} nsURI namespace URI
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
module.exports = function elementNS(nsURI, tag) {
	return new CElement(common.document.createElementNS(nsURI, tag))
}
