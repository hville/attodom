import {D} from '../module'

var sheet = null

export function css(cssRuleText) {
	(sheet || getSheet()).insertRule(
		cssRuleText,
		sheet.cssRules.length
	)
}

function getSheet() {
	var sheets = W.document.styleSheets,
			media = /^$|^all$/ //mediaTypes: all, print, screen, speach

	// get existing sheet
	for (var i=0; i<sheets.length; ++i) {
		sheet = sheets[i]
		if (media.test(sheet.media.mediaText) && !sheet.disabled) return sheet
	}
	// or create a new one
	return sheet = W.document.head.appendChild(W.document.createElement('style')).sheet
}
