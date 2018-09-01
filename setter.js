module.exports = function (key) {
	return function(value) {
		if (this[key] !== value) this[key] = value
	}
}
