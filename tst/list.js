var ct = require('cotest'),
		el = require('../el'),
		co = require('../co'),
		ls = require('../list'),
		root = require('../root'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('list static', function() {
	function setText(t) { console.log('Ha', t, this.node.textContent); this.node.textContent = t }
	function childFactory(v) {
		return co(el('p', v+1), {update: setText})
	}
	var comp = co(el('div'), '^', ls(childFactory), '$'),
			elem = comp.node

	ct('===', toString(elem.childNodes), '^$')

	comp.update([1,2,3,])
	ct('===', toString(elem.childNodes), '^234$')

	comp.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '^4313$')

	comp.update([])
	ct('===', toString(elem.childNodes), '^$')

	comp.update([1,5,3])
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
	function childFactory(v) {
		return co(el('p', v))
	}
	var comp = co(el('div'), ls(childFactory), ls(childFactory), childFactory('$'), ls(childFactory), el('p', '$'), ls(childFactory)),
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
