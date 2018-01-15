var common = require('./context'),
		Component = require('./component')

var svgURI = 'http://www.w3.org/2000/svg'

/**
 * @function svg
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
module.exports = function svg(tag) {
	return new Component(common.document.createElementNS(svgURI, tag))
}
