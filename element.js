var common = require('./common')
var CElement = require('./src/_c-element')

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
module.exports = function element(tagName) {
	return new CElement(common.doc.createElement(tagName))
}
