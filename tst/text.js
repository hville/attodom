var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}


var text = P.text

ct('text - static', function() {
	ct('===', text('a').node.nodeType, 3)
	ct('===', text('ab').node.nodeValue, 'ab')
	ct('===', text('ab').node.parentNode, null)
})

ct('text - dynamic', function() {
	var co = text('abc').extra('update', function(v) { this.text(v+v) })
	ct('===', co.node.nodeValue, 'abc')
	co.update('def')
	ct('===', co.node.nodeValue, 'defdef')
})
