/**
* @param  {!Object|string} key
* @param  {*} [val]
* @return {!Object}
*/
module.exports = function(key, val) {
	if (typeof key === 'object')
		for (var i=0, ks=Object.keys(key); i<ks.length; ++i)
			this[ks[i]] = key[ks[i]]
	else this[key] = val
	return this
}
