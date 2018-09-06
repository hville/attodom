var mount = require('./mount')

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
 * @return {HTMLElement}
 */
module.exports = function(tagName) {
	var node = document.createElement(tagName)

	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (!arg.constructor || arg.constructor === Object) for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (key === 'style') node.style.cssText = val
				else if (typeof val !== 'string' || htmlProps[key]) node[key] = val
				else node.setAttribute(key, val)
			}
			else mount(node, arg)
		}
	}
	return node
}
