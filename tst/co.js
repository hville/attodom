var ct = require('cotest'),
		el = require('../el'),
		co = require('../co'),
		root = require('../root'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
root.document = window.document

function toString(nodes) {
	var str = ''
	if (nodes) for (var i=0; i<nodes.length; ++i) str+=nodes[i].textContent
	return str
}

ct('co - static', function() {
	ct('===', co(el('p')).node.nodeType, 1)
	ct('===', toString(co(el('p', 'ab')).node.childNodes), 'ab')
	ct('===', toString(co(el('p'), 'ab').node.childNodes), 'ab')
})

ct('co - event', function() {
	var cmp = [
		co(el('h0', {onclick: function(e) { e.target.textContent += 'a' }})),
		co(el('h0'), {onclick: function(e) { e.target.textContent += 'a' }}),
		co(el('h0')).on('click', function(e) { e.target.textContent += 'a' })
	]
	ct('===', cmp[0].node.textContent, '')
	ct('===', cmp[1].node.textContent, '')
	ct('===', cmp[2].node.textContent, '')

	cmp[0].node.dispatchEvent(new window.Event('click'))
	ct('===', cmp[0].node.textContent, 'a')
	cmp[1].node.dispatchEvent(new window.Event('click'))
	ct('===', cmp[1].node.textContent, 'a')
	cmp[2].node.dispatchEvent(new window.Event('click'))
	ct('===', cmp[2].node.textContent, 'a')

})

ct('co - default update', function() {
	ct('===', co(el('p')).update('X').node.textContent, 'X')
	ct('===', co(el('p')).update(0).node.textContent, '0')

	ct('===', co(el('input')).update('X').node.value, 'X')
	ct('===', co(el('input')).update(0).node.value, '0')

	ct('===', co(el('div'), co(el('p'))).update(0).node.firstChild.textContent, '0')

	var divi = co(el('div'), co(el('input')))
	ct('===', divi.kids.length, 1)
	ct('===', divi.node.childNodes.length, 1)
	ct('===', divi.node.children.length, 1)

	//ct('===', divi.update(0).node.firstChild.value, '0')
})

ct('element - update', function() {
	var kidB = co(el('span', 'b'), {update: function(v) { this.node.textContent = v.toUpperCase() }}),
			kidC = el('span', 'c')
	var kin = co(el('h0', ['a', kidB, kidC]), {update: function(t) {
		kidB.update(t)
		kidC.textContent = t
	}})
	ct('===', kin.node.textContent, 'abc')
	kin.update('d')
	ct('===', kin.node.textContent, 'aDd')
	kin.update('e')
	ct('===', kin.node.textContent, 'aEe')
})

ct('element - custom element', function() {
	var child = el('h2', 'x')
	var head = co(el('h0', el('h1', child)), {
		update: function(txt) { child.textContent = txt }
	})
	ct('===', head.node.textContent, 'x')
	ct('===', head.node.firstChild.textContent, 'x')
	ct('===', head.node.firstChild.firstChild.textContent, 'x')

	head.update('Y')
	ct('===', head.node.textContent, 'Y')
	ct('===', head.node.firstChild.textContent, 'Y')
	ct('===', head.node.firstChild.firstChild.textContent, 'Y')
})
