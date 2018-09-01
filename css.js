/**
 * @param {string} cssRuleText
 * @return {void}
 */
module.exports = function(cssRuleText) {
	/**@type {CSSStyleSheet} */
	//@ts-ignore
	var sheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet
	sheet.insertRule(
		cssRuleText,
		sheet.cssRules.length
	)
}
