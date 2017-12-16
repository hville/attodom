/**
 * @param  {!Object|string} key
 * @param  {*} [val]
 * @return {!Object}
 */
module.exports = function(key, val) {
	if (typeof key === 'object')
		for (var i=0, ks=Object.keys(key); i<ks.length; ++i)
			//@ts-ignore
			this.node[ks[i]] = key[ks[i]]
	//@ts-ignore
	else this.node[key] = val
	return this
}
