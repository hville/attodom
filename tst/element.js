var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	var win = (new JSDOM).window
	P.setDocument(win.document)
}


var el = P.element

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('element - static', function() {
	ct('===', el('p').node.nodeType, 1)

	// explicit
	ct('===', toString(el('p').child('ab').node.childNodes), 'ab')
	ct('===', el('p').attr('id', 'A').node.id, 'A')

	// automagic
	ct('===', toString(el('p').child('ab').node.childNodes), 'ab')
	ct('===', el('p').attr('data-id', 'A').prop('id', 'A').node.id, 'A')
})

ct('element - mixed children', function() {
	ct('===', el('p').child([0, el('p'), el('p'), el('p')]).node.childNodes.length, 4)
	ct('===', el('p').child([el('p'), [], el('p'), [el('p'), 0]]).node.childNodes.length, 4)
	ct('===', el('p').child([el('p'), null, 0, [el('p'), el('p')]]).node.childNodes.length, 4)
})

ct('element - static, multiple mixed arguments', function() {
	var p = el('p').child(0).class('A').child(1).prop('id', 'B').child(2).node
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
	elm.dispatchEvent(new P.D.defaultView.Event('click'))
	ct('===', elm.textContent, 'a')
	elm.dispatchEvent(new P.D.defaultView.Event('click'))
	ct('===', elm.textContent, 'aa')
})

ct('element - update', function() {
	var co = el('h0').child([
		P.text('a'),
		P.text('b').set('update', function(v) { this.text(v.toUpperCase()) }),
		P.text('c').set('update', function(v) { this.text(v.toUpperCase()); this.update = null })
	])
	ct('===', co.node.textContent, 'abc')

	co.update('d')
	ct('===', co.node.textContent, 'dDD')
	co.update('e')
	ct('===', co.node.textContent, 'eED')
})

ct('element - custom element', function() {
	var child = el('h2').child('x')
	var root = el('h0').child(
		el('h1').child(child)
	)
	root.update = child.text.bind(child)
	ct('===', root.node.textContent, 'x')
	ct('===', root.node.firstChild.textContent, 'x')
	ct('===', root.node.firstChild.firstChild.textContent, 'x')

	root.update('Y')
	ct('===', root.node.textContent, 'Y')
	ct('===', root.node.firstChild.textContent, 'Y')
	ct('===', root.node.firstChild.firstChild.textContent, 'Y')
})
