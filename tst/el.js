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

ct('element - static', function() {
	ct('===', el('p').node.nodeType, 1)

	// explicit
	ct('===', toString(el('p').append('ab').node.childNodes), 'ab')
	ct('===', el('p').a('id', 'A').node.id, 'A')

	// automagic
	ct('===', toString(el('p').append('ab').node.childNodes), 'ab')
	ct('===', el('p').a('data-id', 'A').p('id', 'A').node.id, 'A')
})

ct('element - mixed children', function() {
	ct('===', el('p').append([0, el('p'), el('p'), el('p')]).node.childNodes.length, 4)
	ct('===', el('p').append(el('p'), [], el('p'), [el('p'), 0]).node.childNodes.length, 4)
	ct('===', el('p').append([el('p'), null, 0, [el('p'), el('p')]]).node.childNodes.length, 4)
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p').append(0).a('class', 'A').append(1).p('id', 'B').append(2).node
	ct('===', p.nodeType, 1)
	ct('===', p.firstChild.nodeValue, '0')
	ct('===', p.className, 'A')
	ct('===', p.id, 'B')
	ct('===', p.lastChild.nodeValue, '2')
	ct('===', p.textContent, '012')
})

ct('element - event', function() {
	var cmp = el('h0').on('click', function(e) { e.target.textContent += 'a' }),
			elm = cmp.node

	ct('===', elm.textContent, '')
	elm.dispatchEvent(new window.Event('click'))
	ct('===', elm.textContent, 'a')
	elm.dispatchEvent(new window.Event('click'))
	ct('===', elm.textContent, 'aa')
})

ct('element - update', function() {
	var kidB = el('span').append('b').c('update', function(v) { this.node.textContent = v.toUpperCase() }),
			kidC = el('span').append('c').node
	var co = el('h0').append(['a', kidB, kidC]).c('update', function(t) {
		kidB.update(t)
		kidC.textContent = t
	})
	ct('===', co.node.textContent, 'abc')

	co.update('d')
	ct('===', co.node.textContent, 'aDd')
	co.update('e')
	ct('===', co.node.textContent, 'aEe')
})

ct('element - custom element', function() {
	var child = el('h2').append('x')
	var root = el('h0').append(
		el('h1').append(child)
	)
	root.update = function(txt) { child.node.textContent = txt }
	ct('===', root.node.textContent, 'x')
	ct('===', root.node.firstChild.textContent, 'x')
	ct('===', root.node.firstChild.firstChild.textContent, 'x')

	root.update('Y')
	ct('===', root.node.textContent, 'Y')
	ct('===', root.node.firstChild.textContent, 'Y')
	ct('===', root.node.firstChild.firstChild.textContent, 'Y')
})
