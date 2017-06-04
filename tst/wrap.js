var ct = require('cotest'),
		P = require('../dist/index.js')

if (!P.D) {
	// @ts-ignore
	var JSDOM = require('jsdom').JSDOM //eslint-disable-line global-require
	P.setWindow((new JSDOM).window)
}


var el = P.element

ct('component.wrap sync and async', function(end) {
	var input = el('input')
	.p('value', 'INPUT')
	.wrap('moveTo', function(parent, before) {
		this.parent = P.find(parent)
		parent.textContent = 'CHILD'
		this.node.value = parent.id
	})
	.wrap('remove', function (cb) {
		this.parent.text('ALONE')
		ct('===', cb.length, 0)
		cb()
	})
	var div = el('div').p('id', 'ID').text('DIV')

	ct('===', input.node.value, 'INPUT')
	ct('===', div.node.textContent, 'DIV')
	div.child(input)
	ct('===', input.node.value, 'ID')
	ct('===', div.node.textContent, 'CHILD')
	input.remove()
	setTimeout(function() {
		ct('===', input.node.value, 'ID')
		ct('===', div.node.textContent, 'ALONE')
		end()
	})
})

