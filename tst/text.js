var ct = require('cotest'),
		root = require('../core'),
		tx = require('../text'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

ct('text - nodeType', function() {
	ct('===', tx('div').nodeType, 3)
})
ct('text - update', function() {
	var kin = tx('span', {update: function(v) { this.data = v }})
	ct('===', kin.textContent, 'span')
	//@ts-ignore
	kin.update('abc')
	ct('===', kin.textContent, 'abc')
})
