import css from '../css.js'
import jsdom from 'jsdom'
import t from 'assert-op/assert.js'

//@ts-ignore
global.document = (new jsdom.JSDOM).window.document

//css - add rule
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

t('!!', found)

