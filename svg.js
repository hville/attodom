var core = require('./core'),
		mount = require('./mount')

var svgURI = 'http://www.w3.org/2000/svg'

/**
 * @param {string} tagName
 * @return {Element}
 */
module.exports = function(tagName) {
	var node = core.document.createElementNS(svgURI, tagName)

	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			var typ = arg.constructor
			if (typ === Function) arg(node)
			else if (typ && typ !== Object) mount(node, arg)
			else for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (typeof val !== 'string') node[key] = val
				else node.setAttribute(key, val)
			}
		}
	}
	return node
}
