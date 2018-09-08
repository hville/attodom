/**
 * @param {!Function} make
 * @param {Function|string} [getK]
 * @return {Node}
 */
module.exports = function(make, getK) {
	var kin = document.createComment('['),
			isFunc = getK == null || getK.constructor === Function
	//@ts-ignore
	kin.update = updateList
	//@ts-ignore
	kin._$lK = {
		make: make,
		keyF: isFunc,
		getK: isFunc ? getK || getKey : getK,
		kids: Object.create(null),
		tail: document.createComment(']')
	}
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
 * @param {Array} arr
 * @return {Node}
 */
function updateList(arr) {
	var head = this,
			kin = head.parentNode,
			kids = Object.create(null),
			//@ts-ignore
			list = head._$lK

	// find the parent or create one
	if (!kin) {
		kin = document.createDocumentFragment()
		kin.appendChild(head)
		kin.appendChild(list.tail)
	}

	var spot = head.nextSibling
	for (var i = 0; i < arr.length; ++i) {
		var key = list.keyF ? list.getK(arr[i], i, arr) : arr[i][list.getK],
				kid = list.kids[key]
		//create or update kid
		if (kid && kid.update) kid.update(arr[i], key, arr)
		else kid = list.make(arr[i], i, arr)
		kids[key] = kid

		//place kid
		if (kid === spot.nextSibling) kin.removeChild(spot)
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
