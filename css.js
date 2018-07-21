var root = require('./root')

var media = /^$|^all$/ //mediaTypes: all, print, screen, speach

/**
 * @param {string} cssRuleText
 * @return {void}
 */
module.exports = function css(cssRuleText) {
	var sheet = getSheet()
	//@ts-ignore
	sheet.insertRule(
		cssRuleText,
		//@ts-ignore
		sheet.cssRules.length
	)
}

/**
 * @return {StyleSheet}
 */
function getSheet() {
	var sheets = root.document.styleSheets
	// get existing sheet
	for (var i=0; i<sheets.length; ++i) {
		if (media.test(sheets[i].media.mediaText) && !sheets[i].disabled) return sheets[i]
	}
	// or create a new one
	return root.document.head.appendChild(root.document.createElement('style')).sheet
}
