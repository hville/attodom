var core = require('./core')

/**
 * @param {string} text
 * @return {Node}
 */
module.exports = function(text) {
	var node = core.document.createTextNode(text)
	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			var typ = arg.constructor
			//@ts-ignore
			if (typ === Function) node._$uK = arg
			else if (!typ || typ === Object)
				for (var j=0, ks=Object.keys(arg); j<ks.length; ++j)
					node[ks[j]] = arg[ks[j]]
		}
	}
	return node
}
