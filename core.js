module.exports = {
	document: typeof document !== 'undefined' ? document : null,

	/** @type {WeakMap<Node, Function>} */
	updaters: new WeakMap, //node: (node, v,i) => node

	/** @type {WeakMap<Node, {kids:Object, make:Function, getK:Function, tail:Node}>} */
	liveLists: new WeakMap
}
