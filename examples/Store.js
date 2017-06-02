// generic simple store for the examples

export function Store(config) {
	this.data = {}
	for (var i=0, ks=Object.keys(config); i<ks.length; ++i) this[ks[i]] = config[ks[i]]
}

Store.prototype = {
	constructor: Store,

	get: function(path) {
		var data = this.data
		switch (arguments.length) {
			case 0: return data
			case 1:
				if (Array.isArray(path)) {
					for (var i=0; i<path.length; ++i) if ((data = data[path[i]]) === undefined) break
					return data
				}
				else return data[path]
			default:
				return this.get.apply(this, arguments)
		}
	},

	set: function(value, path) {
		var data = this.data
		switch (arguments.length) {
			case 0: throw Error('value required')
			case 1:
				this.data = value
				break
			case 2:
				if (Array.isArray(path)) {
					for (var i=0; i<(path.length-1); ++i) if ((data = data[path[i]]) === undefined) throw Error('invalid path '+path.join())
					data[path[path.length-1]] = value
				}
				else {
					data[path] = value
				}
				break
			default:
				throw Error('invalid argument')
		}
		if (this.onchange) this.onchange()
	},

	act: function(name, args) {
		return this[name].apply(this, args)
	}
}
