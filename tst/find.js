/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		el = require('../el'),
		find = require('../find')

ct('find', function() {
	var h01 = el('h2', 'H01'),
			h0 = el('h1', ['H0', el('h2', 'H00'), h01]),
			h10 = el('h2', 'H10'),
			h1 = el('h1', 'H1', h10, el('h2', 'H11')),
			h = el('div', ['H', h0, h1])

	ct('===', find(h, c=>c.textContent === 'H10'), h10)
	ct('===', find(h, c=>c.textContent === 'H10'), h10)

	ct('===', find(h, c=>c.textContent === 'H10', h10), h10)
	ct('===', find(h, c=>c.textContent === 'H10', h10), h10)

	ct('===', find(h, c=>c.textContent === 'H10', h01), null)
	ct('===', find(h, c=>c.textContent === 'H10', h01), null)
})
