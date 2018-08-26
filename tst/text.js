var ct = require('cotest'),
		update = require('..').update,
		root = require('../core'),
		tx = require('../text'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

ct('text - nodeType', function() {
	ct('===', tx('div').nodeType, 3)
})
ct('text - update', function() {
	var kin = tx('span', function(n,v) { n.data = v })
	ct('===', kin.textContent, 'span')
	ct('===', update(kin, 'abc').textContent, 'abc')
})
