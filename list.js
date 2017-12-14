var CKeyed = require('./src/_c-keyed')

/**
 * @function
 * @param {!Function} factory
 * @param {Function} [getKey]
 * @return {!Object} Component
 */
module.exports = function list(factory, getKey) {
	return new CKeyed(factory, getKey)
}
