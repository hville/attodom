var ct = require('cotest'),
		text = require('../text'),
		common = require('../config'),
		JSDOM = require('jsdom').JSDOM

common.document = (new JSDOM).window.document

ct('text - static', function() {
	ct('===', text('a').node.nodeType, 3)
	ct('===', text('ab').node.nodeValue, 'ab')
	ct('===', text('ab').node.parentNode, null)
})

ct('text - dynamic - default', function() {
	var co = text('abc')
	ct('===', co.node.nodeValue, 'abc')
	co.update('def')
	ct('===', co.node.nodeValue, 'def')
})

ct('text - dynamic - custom', function() {
	var co = text('abc').c('update', function(v) { this.node.textContent = v+v })
	ct('===', co.node.nodeValue, 'abc')
	co.update('def')
	ct('===', co.node.nodeValue, 'defdef')
})
