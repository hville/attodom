var common = require('./context'),
		Component = require('./component')

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
module.exports = function element(tagName) {
	return new Component(common.document.createElement(tagName))
}
