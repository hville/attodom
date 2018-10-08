function setData(value) {
	if (this.data !== value) this.data = value
}

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
