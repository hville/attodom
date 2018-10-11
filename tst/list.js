/* global document */
var JSDOM = require('jsdom').JSDOM
//@ts-ignore
global.document = (new JSDOM).window.document

var ct = require('cotest'),
		el = require('../').el,
		ls = require('../').list

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) if (nodes[i].nodeType!==8) str+=nodes[i].textContent
	return str
}
function upperKid(t) {
	return el('p', t.toUpperCase(), {update: function(t) { this.textContent = t }})
}

ct('list - empty parent', function() {
	var kin = el('div'),
			list = ls(kin, upperKid)
	ct('===', toString(kin.childNodes), '')
	list.update(['a'])
	ct('===', toString(kin.childNodes), 'A')
	list.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB')
	list.update(['a'])
	ct('===', toString(kin.childNodes), 'a')
	list.update([])
	ct('===', kin.childNodes.length, 0)
	ct('===', Object.keys(list.map).length, 0)
})

ct('list mounted with next', function() {
	var kin = el('div', '$'),
			list = ls(kin, upperKid, {before: kin.firstChild})
	ct('===', toString(kin.childNodes), '$')
	list.update(['a'])
	ct('===', toString(kin.childNodes), 'A$')
	list.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'aB$')
	list.update(['a'])
	ct('===', toString(list.parent.childNodes), 'a$')
})

ct('list function key getter', function() {
	var kin = el('h0'),
			list = ls(
				kin,
				function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) },
				{key: function(o) { return o.k }}
			)
	ct('===', toString(kin.childNodes), '')
	list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abc')
	list.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
	ct('===', toString(kin.childNodes), 'Cde')
	list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abC')
})

ct('list string key getter', function() {
	var kin = el('h0'),
			list = ls(
				kin,
				function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) },
				{key: 'k'}
			)
	ct('===', toString(kin.childNodes), '')
	list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abc')
	list.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
	ct('===', toString(kin.childNodes), 'Cde')
	list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
	ct('===', toString(kin.childNodes), 'abC')
})

ct('list multiple', function() {
	var kin = el('div', '$'),
			ls1 = ls(kin, upperKid, {before: kin.firstChild}),
			ls2 = ls(kin, upperKid, {after: kin.firstChild})
	ct('===', toString(kin.childNodes), '$')
	ls1.update(['a'])
	ct('===', toString(kin.childNodes), 'A$')
	ls2.update(['a', 'b'])
	ct('===', toString(kin.childNodes), 'A$AB')
})
