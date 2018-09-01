/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		svg = require('../svg')

ct('svg', function() {
	ct('===', svg('svg').nodeType, 1)
	ct('===', svg('path').nodeType, 1)

	ct('===', svg('path').attributes.length, 0)
	ct('===', svg('path', {d: 'm37', stroke: 'green'}).attributes.length, 2)
	ct('===', svg('path', {d: 'm37'}, {stroke: 'green'}).attributes.length, 2)

	ct('===', svg('g').childNodes.length, 0)
	ct('===', svg('svg', svg('g'), svg('g')).childNodes.length, 2)
})
