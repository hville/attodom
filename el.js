var root = require('./root'),
		mount = require('./mount')

var htmlProps = {
	id: true,
	nodeValue: true,
	textContent: true,
	className: true,
	innerHTML: true,
	tabIndex: true,
	value: true
}

/**
 * @param {string} tagName
 * @return {Element}
 */
module.exports = function(tagName) {
	var node = root.document.createElement(tagName)
	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (arg.constructor && arg.constructor !== Object) mount(node, arg)
			else for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (key === 'style') node.style.cssText = val
				else if (typeof val !== 'string' || htmlProps[key]) node[key] = val
				else node.setAttribute(key, val)
			}
		}
	}
	return node
}
