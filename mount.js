var root = require('./root')

/**
 * @param {Element|{node: Element}} parent
 * @param {*} child
 * @return {Element}
 */
module.exports = function mount(parent, child) {
	//@ts-ignore
	var comp = parent.node ? parent : null,
			//@ts-ignore
			node = comp ? comp.node : parent,
			last = null
	if (child != null) switch (child.constructor) {
		case Array:
			for (var i=0; i<child.length; ++i) last = mount(parent, child[i])
			break
		case String: case Number:
			last = node.appendChild(root.document.createTextNode(''+child))
			break
		default:
			if (child.nodeType) last = node.appendChild(child)
			else if (child.node) {
				node.appendChild(child.node)
				//@ts-ignore
				if (comp) comp.kids.push(child)
			}
			else throw Error('invalid child')
		}
	return last
}
