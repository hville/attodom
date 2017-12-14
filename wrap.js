/**
 * @param {Object} component
 * @param {string} name
 * @param {Function} action
 * @return {Object}
 */
module.exports = function wrap(component, name, action) {
	var method = component.constructor.prototype[name],
			arity = method.length,
			async = (action.length === arity + 1)

	component[name] = function() {
		var len = arguments.length,
				args = Array(arity)

		for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null
		if (async) {
			action.apply(component, args.concat(function() {
				if (arguments.length) throw Error('callback takes no argument')
				method.apply(component, args)
			}))
		}
		else {
			action.apply(component, args)
			method.apply(component, args)
		}
		return component
	}

	return component
}
