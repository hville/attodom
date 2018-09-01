/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		css = require('../css')

ct('css - add rule', function() {
	var sheets = document.styleSheets,
			sheet = null,
			match = /myClass/,
			found = false

	css('.myClass { color: white }')

	// get existing sheet
	for (var i=0; i<sheets.length && !found; ++i) {
		sheet = sheets[i]
		//@ts-ignore
		for (var j=0; j<sheet.cssRules.length && !found; ++j) {
			//@ts-ignore
			found = match.test(sheet.cssRules[i].cssText)
		}
	}

	ct('!!', found)
})
