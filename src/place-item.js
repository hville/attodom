module.exports = function(parent, item, spot, foot) {
	if (!spot) item.moveTo(parent)
	else if (item.node === spot.nextSibling) parent.insertBefore(item.node, foot)
	else if (item.node !== spot) parent.insertBefore(item.node, spot)
	return item.foot || item.node
}
