var ct = require('cotest'),
		el = require('../el'),
		common = require('../context'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
common.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('list static', function() {
	var childFactory = function() { return el('p').append('x').c('update', function(t) { this.node.textContent = t }) },
			co = el('div'),
			elem = co.node

	ct('===', co.append('^'), co)
	ct('===', co.list(childFactory), co)
	ct('===', co.append('$'), co)

	ct('===', toString(elem.childNodes), '^$')

	co.update([1,2,3])
	ct('===', toString(elem.childNodes), '^123$')

	co.update([4,3,1,2])
	ct('===', toString(elem.childNodes), '^4312$')

	co.update([])
	ct('===', toString(elem.childNodes), '^$')

	co.update([1,5,3])
	ct('===', toString(elem.childNodes), '^153$')
})


ct('list keyed', function() {
	var co = el('h0').list(function() {
		return el('p').append('x').c('update', function(v) { this.node.textContent = v.v; this.update = null })
	}, v => v.k)
	var elem = co.node

	ct('===', toString(elem.childNodes), '')

	co.update([{k: 1, v:1}, {k: 'b', v:'b'}])
	ct('===', toString(elem.childNodes), '1b')

	co.update([{ k: 'b', v: 'bb' }, { k: 1, v: 11 }])
	ct('===', toString(elem.childNodes), 'b1', 'must use existing nodes')

	co.update([{k: 'c', v:'c'}])
	ct('===', toString(elem.childNodes), 'c')

	co.update([{ k: 'b', v: 'bbb' }, { k: 'c', v: 'ccc' }, { k: 1, v: 111 }])
	ct('===', toString(elem.childNodes), 'bbbc111', 're-creates removed nodes')
})
