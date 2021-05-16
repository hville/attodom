/**
 * @param {Element} parent
 * @param {Function} factory
 * @param {Object} [options]
 * @return {Object}
 */
export default function(parent, factory, options) {
	return {
		parent: parent,
		factory: factory,
		before: (options && options.before) || null,
		after: (options && options.after) || null,
		update: updateList,
		key: (options && options.key) || ( (v,i) => i ), //TODO simplify
		map: Object.create(null),
	}
}

/**
 * @param {Array} arr
 * @return {Node}
 */
function updateList(arr) {
	var	parent = this.parent,
			spot = this.after ? this.after.nextSibling : parent.firstChild,
			getK = this.key,
			kids = Object.create(null)

	if (!arr.length && !this.before && !this.after) parent.textContent = ''
	else {
		for (var i = 0; i < arr.length; ++i) {
			//TODO skip .constructor
			var key = getK.constructor === Function ? getK(arr[i], i, arr) : arr[i][getK], //TODO simplify to functions only
					kid = this.map[key]
			//create or update kid
			if (kid) kid.update && kid.update(arr[i], key, arr) //eslint-disable-line
			else kid = this.factory(arr[i], i, arr)
			kids[key] = kid

			//place kid
			if (!spot) parent.appendChild(kid)
			else if (kid === spot.nextSibling) parent.removeChild(spot)
			else if (kid !== spot) parent.insertBefore(kid, spot)
			spot = kid.nextSibling
		}
		//delete remaining
		while (spot !== this.before) {
			var next = spot.nextSibling
			parent.removeChild(spot)
			spot = next
		}
	}

	this.map = kids
	return this
}
