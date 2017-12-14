var ct = require('cotest'),
		css = require('../css'),
		common = require('../common'),
		JSDOM = require('jsdom').JSDOM

var document = common.doc = (new JSDOM).window.document

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
