/* global document */
var setter = require('./setter')

var setData = setter('data')

/**
 * @param {string} text
 * @return {Text}
 */
module.exports = function(text) {
	var node = document.createTextNode(text)
	//@ts-ignore
	node.update = setData
	return node
}
