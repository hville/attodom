var ct = require('cotest'),
		el = require('../el'),
		ls = require('../list'),
		core = require('../core'),
		update = require('../update'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
core.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) if (nodes[i].nodeType!==8) str+=nodes[i].textContent
	return str
}
function setText(n,t) {
	n.textContent = t
}
function upperKid(t) {
	return el('p', t.toUpperCase(), setText)
}

ct.only('list detached', function() {
	var list = ls(upperKid)
	update(list, ['a'], null, null)
	ct('===', toString(list.parentNode.childNodes), 'A')
	update(list, ['a', 'b'], null, null)
	ct('===', toString(list.parentNode.childNodes), 'aB')
	update(list, ['a'], null, null)
	ct('===', toString(list.parentNode.childNodes), 'a')
})
ct.only('list mounted', function() {
	var list = ls(upperKid),
			kin = el('div', list)
	ct('===', toString(kin.childNodes), '')
	update(list, ['a'], null, null)
	ct('===', toString(kin.childNodes), 'A')
	update(list, ['a', 'b'], null, null)
	ct('===', toString(kin.childNodes), 'aB')
	update(list, ['a'], null, null)
	ct('===', toString(list.parentNode.childNodes), 'a')
})
ct.only('list mounted with next', function() {
	var list = ls(upperKid),
			kin = el('div', list, '$')
	ct('===', toString(kin.childNodes), '$')
	update(list, ['a'], null, null)
	ct('===', toString(kin.childNodes), 'A$')
	update(list, ['a', 'b'], null, null)
	ct('===', toString(kin.childNodes), 'aB$')
	update(list, ['a'], null, null)
	ct('===', toString(list.parentNode.childNodes), 'a$')
})


ct('list static', function() {
	var elem = el('div', '^', ls(upperKid), '$')
	ct('===', toString(elem.childNodes), '^$')

	update(elem, [1,2,3])
	ct('===', toString(elem.childNodes), '^234$')

	update(elem, [4,3,1,2])
	ct('===', toString(elem.childNodes), '^4313$')

	update(elem, [])
	ct('===', toString(elem.childNodes), '^$')

	update(elem, [1,5,3])
	ct('===', toString(elem.childNodes), '^264$')
})


ct('list keyed', function() {
	var comp = co(el('h0'), ls(
		function(v) {
			return co(el('p'), v.k, {update: function(v) { this.node.textContent = v.v; this.update = null }})
		},
		v => v.k
	))
	var elem = comp.node

	ct('===', toString(elem.childNodes), '')

	comp.update([{k: 1, v:1}, {k: 'b', v:'b'}])
	ct('===', toString(elem.childNodes), '1b')

	comp.update([{ k: 'b', v: 'bb' }, { k: 1, v: 11 }])
	ct('===', toString(elem.childNodes), 'bb11', 'must use existing nodes')

	comp.update([{k: 'c', v:'c'}])
	ct('===', toString(elem.childNodes), 'c')

	comp.update([{ k: 'b', v: 'bbb' }, { k: 'c', v: 'ccc' }, { k: 1, v: 111 }])
	ct('===', toString(elem.childNodes), 'bccc1', 're-creates removed nodes')
})

ct('list - multiple', function() {
	function upperKid(v) {
		return co(el('p', v))
	}
	var comp = co(el('div'), ls(upperKid), ls(upperKid), upperKid('$'), ls(upperKid), el('p', '$'), ls(upperKid)),
			elem = comp.node

	ct('===', toString(elem.childNodes), '<>$$')

	comp.update([1,2,3])
	ct('===', toString(elem.childNodes), '112233<>112233$')

	comp.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '43122<>43122$')

	comp.update([])
	ct('===', toString(elem.childNodes), '<>$')

	comp.update([1,5,3])
	ct('===', toString(elem.childNodes), '115533<>115533$')
})
