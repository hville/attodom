// @ts-check
var create = require('./src/create'),
		W = require('./src/window')

module.exports = {
	text: create.text,
	element: create.element,
	elementNS: create.elementNS,
	svg: create.svg,
	list: create.list,
	component: create.component,
	get document() { return W.D },
	set document(doc) { W.D = doc }
}
