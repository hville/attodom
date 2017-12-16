var common = require('../config')

module.exports = function(parent, item, spot, foot) {
	if (!spot) item.moveTo(parent)
	else if (item.node === spot.nextSibling) spot[common.key].moveTo(parent, foot)
	else if (item.node !== spot) item.moveTo(parent, spot)
	return item.foot || item.node
}
