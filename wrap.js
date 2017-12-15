/**
 * @param {Object} component
 * @param {string} name
 * @param {Function} action
 * @return {Object}
 */
module.exports = function wrap(component, name, action) {
	var method = Object.getPrototypeOf(component)[name].bind(component),
			arity = action.length-1

	component[name] = function() {
		var len = arguments.length,
				args = Array(len)
		for (var i = 0; i<arity; ++i) args[i] = i<len ? arguments[i] : null
		args[i] = method
		action.apply(component, args)
		return component
	}

	return component
}
