var ct = require('cotest'),
		el = require('../').el,
		update = require('../').update,
		updateChildren = require('../').updateChildren,
		root = require('../core'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

ct('element-nodeType', function() {
	ct('===', el('div').nodeType, 1)
	ct('===', el('p').nodeType, 1)
})

ct('element-properties', function() {
	ct('===', el('div').attributes.length, 0)
	ct('===', el('div', {id: 'id'}).id, 'id')
	//@ts-ignore
	ct('===', el('div', {onchange: e=>e}).onchange.constructor, Function)
	ct('===', el('div', {className: 'className'}).className, 'className')
	//@ts-ignore
	ct('===', el('input', {value: 'value'}).value, 'value')
	ct('===', el('p', {textContent: 'textContent'}).textContent, 'textContent')
})

ct('element-attributes', function() {
	ct('===', el('div').attributes.length, 0)
	ct('===', el('div', {class: 'class'}).attributes.length, 1)
	ct('===', el('div', {style: 'style'}).attributes.length, 1)
	ct('===', el('div', {'data-set': 'data-set'}).attributes.length, 1)
	ct('===', el('div', {value: 'value'}).attributes.length, 0)
})

ct('element - mixed children', function() {
	ct('===', el('p', [0, el('p'), el('p'), el('p')]).childNodes.length, 4)
	ct('===', el('p', el('p'), [], el('p'), [el('p'), 0]).childNodes.length, 4)
	ct('===', el('p', [el('p'), null, 0, [el('p'), el('p')]]).childNodes.length, 4)
})

ct('el - event', function() {
	var kin = el('h0', {onclick: function(e) { e.target.textContent += 'a' }})
	kin.dispatchEvent(new window.Event('click'))
	ct('===', kin.textContent, 'a')
})

ct('element - update', function() {
	var kin = el('span', 'b', function(n,v) { n.textContent = v.toUpperCase() })
	ct('===', kin.textContent, 'b')
	ct('===', update(kin, 'abc', null, null).textContent, 'ABC')
})

ct('element - updateChildren', function() {
	var kid = el('span', 'b', function(n,v) { n.textContent = v.toUpperCase() }),
			kin = el('h0', ['a', kid, el('span', 'c')], updateChildren)
	ct('===', kin.textContent, 'abc')
	ct('===', update(kin, 'abc', null, null).textContent, 'aABCc')
})

