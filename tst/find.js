var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}

var el = P.element,
		find = P.find


ct('find', function() {
	var h01 = el('h2').text('H01'),
			h0 = el('h1').child(['H0', el('h2').text('H00'), h01]),
			h10 = el('h2').text('H10'),
			h1 = el('h1').child(['H1', h10, el('h2').text('H11')]),
			h = el('div').child(['H', h0, h1])

	ct('===', find(h), h)
	ct('===', find(h.node), h)
	ct('===', find(h.node.firstChild), h0)

	ct('===', find(h, c=>c.node.textContent === 'H10'), h10)
	ct('===', find(h, c=>c.node.textContent === 'H10', h10), h10)
	ct('===', find(h, c=>c.node.textContent === 'H10', h01), null)
})
