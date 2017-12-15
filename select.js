var CSelect = require('./src/_c-select')


/**
 * @function
 * @param {!Object|!Array} items
 * @param {function([*], [string], [Object]):Array<string>} [getKeys]
 * @return {!Object} Component
 */
module.exports = function select(items, getKeys) {
	return new CSelect(items, getKeys)
}
