var ct = require('cotest'),
		text = require('../text'),
		common = require('../common'),
		JSDOM = require('jsdom').JSDOM

common.doc = (new JSDOM).window.document

ct('text - static', function() {
	ct('===', text('a').node.nodeType, 3)
	ct('===', text('ab').node.nodeValue, 'ab')
	ct('===', text('ab').node.parentNode, null)
})

ct('text - dynamic', function() {
	var co = text('abc').set('update', function(v) { this.text(v+v) })
	ct('===', co.node.nodeValue, 'abc')
	co.update('def')
	ct('===', co.node.nodeValue, 'defdef')
})
