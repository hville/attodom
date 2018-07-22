var core = require('./core')

/**
 * @param {!Function} make
 * @param {Function} [getK]
 * @return {Node}
 */
module.exports = function(make, getK) {
	var kin = core.document.createComment('>')
	core.liveLists.set(kin, {
		make: make,
		getK: getK || getKey,
		kids: Object.create(null),
		tail: core.document.createComment('<')
	})
	core.updaters.set(kin, updateList)
	return kin
}

/**
 * @param {*} v
 * @param {number} i
 * @return {number}
 */
function getKey(v,i) {
	return i
}

/**
 * @param {Node} head
 * @param {Array} arr
 * @return {Node}
 */
function updateList(head, arr) {
	var kin = head.parentNode,
			kids = Object.create(null),
			list = core.liveLists.get(head)

	// find the parent or create one
	if (!kin) {
		kin = core.document.createDocumentFragment()
		kin.appendChild(head)
		kin.appendChild(list.tail)
	}

	var spot = head.nextSibling
	for (var i = 0; i < arr.length; ++i) {
		var key = list.getK(arr[i], i, arr),
				kid = list.kids[key]
		//create or update kid
		if (kid) {
			var updt = core.updaters.get(kid)
			if (updt) updt(kid, arr[i], key, arr)
		}
		else kid = list.make(arr[i], i, arr)
		kids[key] = kid

		//place kid
		if (!spot) kin.appendChild(kid)
		else if (kid === spot.nextSibling) kin.insertBefore(spot, list.tail)
		else if (kid !== spot) kin.insertBefore(kid, spot)
		spot = kid.nextSibling
	}
	//delete remaining
	while (spot !== list.tail) {
		var next = spot.nextSibling
		kin.removeChild(spot)
		spot = next
	}

	list.kids = kids
	return list.tail
}
