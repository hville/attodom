/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		tx = require('../text')

ct('text - nodeType', function() {
	ct('===', tx('div').nodeType, 3)
})
ct('text - update data', function() {
	var kin = tx('span', {update: function(v) { this.data = v }})
	ct('===', kin.textContent, 'span')
	//@ts-ignore
	kin.update('abc')
	ct('===', kin.textContent, 'abc')
})
ct('text - update default', function() {
	var kin = tx('span')
	ct('===', kin.textContent, 'span')
	//@ts-ignore
	kin.update('abc')
	ct('===', kin.textContent, 'abc')
})
