var W = require('./window')
var attoKey = require('./atto-key')

/**
 * @param {Object} node
 * @param {string} node
 * @param {Function} node
 */
module.exports = function wrap(component, name, action) {
	var method = this.constructor.prototype[name],
			arity = method.length,
			async = (action.length === arity + 1)

	this[name] = function() {
		var len = arguments.length,
				args = Array(arity)

		for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null
		if (async) {
			var ctx = this
			action.apply(this, args.concat(function() {
				if (arguments.length) throw Error('callback takes no argument')
				method.apply(ctx, args)
			}))
		}
		else {
			action.apply(this, args)
			method.apply(this, args)
		}
		return this
	}

	return this
}
