module.exports = function (nodeKey) {
	return function(node, data) {
		node[nodeKey] = data
	}
}
