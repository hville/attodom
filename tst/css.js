var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}

ct('css - add rule', function() {
	var sheets = P.D.styleSheets,
			sheet = null,
			match = /myClass/,
			found = false

	P.css('.myClass { color: white }')

	// get existing sheet
	for (var i=0; i<sheets.length && !found; ++i) {
		sheet = sheets[i]
		for (var j=0; j<sheet.cssRules.length && !found; ++j) {
			found = match.test(sheet.cssRules[i].cssText)
		}
	}
	ct('!!', found)
})
