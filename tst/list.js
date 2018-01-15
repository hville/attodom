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
	var childFactory = function() { return el('p').append('x') },
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

ct('list nested', function() {
	var childFactory = function() { return el('h0').append('') },
			co = el('div').append('^').list(() => el('span').list(childFactory) ).append('$').c('update', function(a) {this.updateList(a)}),
			elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update([[1,2],[3,4]])
	ct('===', toString(elem.childNodes), '^^12$^34$$')

	co.update([[1],[],[2,3,4]])
	ct('===', toString(elem.childNodes), '^^1$^$^234$$')

	co.update([[1,2,3,4]])
	ct('===', toString(elem.childNodes), '^^1234$$')
})

ct('list keyed', function() {
	var co = el('h0').append(
		list(function() {
			return text('x').c('update', function(v) { this.node.textContent = v.v; this.update = null })
		}).c('getKey', v => v.k)
	)
	var elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update([{k: 1, v:1}, {k: 'b', v:'b'}])
	ct('===', toString(elem.childNodes), '^1b$')

	co.update([{ k: 'b', v: 'bb' }, { k: 1, v: 11 }])
	ct('===', toString(elem.childNodes), '^b1$', 'must use existing nodes')

	co.update([{k: 'c', v:'c'}])
	ct('===', toString(elem.childNodes), '^c$')

	co.update([{ k: 'b', v: 'bbb' }, { k: 'c', v: 'ccc' }, { k: 1, v: 111 }])
	ct('===', toString(elem.childNodes), '^bbbc111$', 're-creates removed nodes')
})

ct('list select', function() {
	var co = el('h0').append(
		select({
			a: text('').c('update', function(v) { this.node.textContent = 'a'+v }),
			b: text('').c('update', function(v) { this.node.textContent = 'b'+v })
		}).c('select', v => v)
	)
	var elem = co.node

	ct('===', toString(elem.childNodes), '^$')

	co.update('a')
	ct('===', toString(elem.childNodes), '^aa$')

	co.update('b')
	ct('===', toString(elem.childNodes), '^bb$')

	co.update('c')
	ct('===', toString(elem.childNodes), '^$')
})
