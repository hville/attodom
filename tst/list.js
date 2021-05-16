import el from '../el.js'
import ls from '../list.js'
import jsdom from 'jsdom'
import t from 'assert-op/assert.js'

var JSDOM = jsdom.JSDOM
var window = (new JSDOM).window
global.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) if (nodes[i].nodeType!==8) str+=nodes[i].textContent
	return str
}
function upperKid(s) {
	return el('p', s.toUpperCase(), {update: function(x) { this.textContent = x }})
}

// list - empty parent
var kin = el('div'),
		list = ls(kin, upperKid)
t('===', toString(kin.childNodes), '')
list.update(['a'])
t('===', toString(kin.childNodes), 'A')
list.update(['a', 'b'])
t('===', toString(kin.childNodes), 'aB')
list.update(['a'])
t('===', toString(kin.childNodes), 'a')
list.update([])
t('===', kin.childNodes.length, 0)
t('===', Object.keys(list.map).length, 0)

// list mounted with next
kin = el('div', '$')
list = ls(kin, upperKid, {before: kin.firstChild})
t('===', toString(kin.childNodes), '$')
list.update(['a'])
t('===', toString(kin.childNodes), 'A$')
list.update(['a', 'b'])
t('===', toString(kin.childNodes), 'aB$')
list.update(['a'])
t('===', toString(list.parent.childNodes), 'a$')

// list function key getter
kin = el('h0')
list = ls(
	kin,
	function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) },
	{key: function(o) { return o.k }}
)
t('===', toString(kin.childNodes), '')
list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
t('===', toString(kin.childNodes), 'abc')
list.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
t('===', toString(kin.childNodes), 'Cde')
list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
t('===', toString(kin.childNodes), 'abC')

// list string key getter
kin = el('h0')
list = ls(
	kin,
	function(o) { return el('p', o.v, {update: function(v) { this.textContent = v.v.toUpperCase() }}) },
	{key: 'k'}
)
t('===', toString(kin.childNodes), '')
list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
t('===', toString(kin.childNodes), 'abc')
list.update([{k: 'c', v:'c'}, {k: 'd', v:'d'}, {k: 'e', v:'e'}, ])
t('===', toString(kin.childNodes), 'Cde')
list.update([{k: 'a', v:'a'}, {k: 'b', v:'b'}, {k: 'c', v:'c'}])
t('===', toString(kin.childNodes), 'abC')

// list multiple
kin = el('div', '$')
var ls1 = ls(kin, upperKid, {before: kin.firstChild}),
		ls2 = ls(kin, upperKid, {after: kin.firstChild})
t('===', toString(kin.childNodes), '$')
ls1.update(['a'])
t('===', toString(kin.childNodes), 'A$')
ls2.update(['a', 'b'])
t('===', toString(kin.childNodes), 'A$AB')
