var EVENTS = require('./src/events')

/**
 * @param {string} tagName
 * @return {Element}
 */
module.exports = function(tagName) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', tagName)

	for (var i=1; i<arguments.length; ++i) {
		var arg = arguments[i]
		if (arg != null) {
			if (!arg.constructor || arg.constructor === Object) for (var j=0, ks=Object.keys(arg); j<ks.length; ++j) {
				var key = ks[j],
						val = arg[key]
				if (typeof val !== 'string') {
					node[key] = val
					//set synthetic events for onUpperCaseName
					if (key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) < 91 && key.charCodeAt(2) > 64 && !EVENTS[key]) {
						document.addEventListener(key.slice(2).toLowerCase(), function(e) { //eslint-disable-line
							var tgt = e.target
							do if (tgt[key]) return tgt[key](e)
							//@ts-ignore
							while((tgt = tgt.parentNode))
						})
						EVENTS[key] = true
					}
				}
				else node.setAttribute(key, val)
			}
			else {
				if (Array.isArray(arg)) for (var k=0; k<arg.length; ++k) node.appendChild(
					arg[k].nodeType ? arg[k] : document.createTextNode(arg[k])
				)
				else node.appendChild(arg.nodeType ? arg : document.createTextNode(arg))
			}
		}
	}
	return node
}
