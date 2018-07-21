var ct = require('cotest'),
		el = require('../el'),
		co = require('../co'),
		find = require('../find'),
		root = require('../root'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

ct('find', function() {
	var h01 = co(el('h2', 'H01')),
			h0 = co(el('h1', ['H0', el('h2', 'H00'), h01])),
			h10 = co(el('h2', 'H10')),
			h1 = co(el('h1', 'H1', h10, el('h2', 'H11'))),
			h = co(el('div', ['H', h0, h1]))

	ct('===', find(h, c=>c.textContent === 'H10'), h10.node)
	ct('===', find(h.node, c=>c.textContent === 'H10'), h10.node)

	ct('===', find(h, c=>c.textContent === 'H10', h10), h10.node)
	ct('===', find(h.node, c=>c.textContent === 'H10', h10), h10.node)

	ct('===', find(h, c=>c.textContent === 'H10', h01), null)
	ct('===', find(h.node, c=>c.textContent === 'H10', h01), null)
})
