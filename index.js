// @ts-check
var common = require('./common')

/* eslint-disable global-require */
module.exports = {
	component: require('./component'),
	text: require('./text'),
	svg: require('./svg'),
	element: require('./element'),
	elementNS: require('./elementNS'),
	list: require('./list'),
	select: require('./list'),
	wrap: require('./wrap'),
	find: require('./find'),
	css: require('./css'),
	setDocument: function(doc) { return common.D = doc }
}
