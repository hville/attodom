/* global document */
var JSDOM = require('jsdom').JSDOM
var window = (new JSDOM).window
//@ts-ignore
global.document = window.document

var ct = require('cotest'),
		el = require('../').el,
		updateChildren = require('../').updateChildren

ct('element-nodeType', function() {
	ct('===', el('div').nodeType, 1)
	ct('===', el('p').nodeType, 1)
})

ct('element-properties', function() {
	ct('===', el('div').attributes.length, 0)
	ct('===', el('div', {id: 'id'}).id, 'id')
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
	var kin = el('h1', {onclick: function(e) { this.textContent += e.target.tagName }})
	kin.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', kin.textContent, 'H1')
})

ct('el - synthetic event', function() {
	var h2 = el('h2'),
			h1 = el('h1', {onClick: function(e) { this.textContent = e.target.tagName }}, h2)
	document.body.appendChild(h1)
	h2.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', h1.textContent, 'H2')
	h1.dispatchEvent(new window.Event('click', {bubbles:true}))
	ct('===', h1.textContent, 'H1')
})

ct('element - update', function() {
	var kin = el('span', 'b', {update: function(v) { this.textContent = v.toUpperCase() }})
	ct('===', kin.textContent, 'b')
	//@ts-ignore
	kin.update('abc')
	ct('===', kin.textContent, 'ABC')
})

ct('element - updateChildren', function() {
	var kid = el('span', 'b', {update: function(v) { this.textContent = v.toUpperCase() }}),
			kin = el('h1', ['a', kid, el('span', 'c')], {update: updateChildren})
	ct('===', kin.textContent, 'abc')
	//@ts-ignore
	kin.update('abc')
	ct('===', kin.textContent, 'aABCc')
})

ct('element - nested reference', function() {
	var kid = el('span', 'b'),
			kin = el('h1', el('h2', el('h3', el('h4', kid))), {
				__kid: kid,
				update: function(v) { this.__kid.textContent = v }
			})

	ct('===', kid.textContent, 'b')
	//@ts-ignore
	kin.update('B')
	ct('===', kid.textContent, 'B')
})
