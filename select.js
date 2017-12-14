var CSelect = require('./src/_c-select')


/**
 * @function
 * @param {!Object|!Array} items
 * @param {Function} [getKeys]
 * @return {!Object} Component
 */
module.exports = function select(items, getKeys) {
	return new CSelect(items, getKeys)
}
