var common = require('./common')
var CNode = require('./src/_c-node')

/**
 * @function text
 * @param {!string} txt textContent
 * @return {!Object} Component
 */
module.exports = function textNode(txt) {
	return new CNode(common.doc.createTextNode(txt))
}
