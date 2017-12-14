var ct = require('cotest'),
		el = require('../element'),
		find = require('../find'),
		wrap = require('../wrap'),
		common = require('../common'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
common.doc = window.document

ct('component.wrap sync and async', function(end) {
	var input = el('input').p('value', 'INPUT'),
			div = el('div').p('id', 'ID').text('DIV')

	wrap(input, 'moveTo', function(parent) {
		this.parent = find(parent)
		parent.textContent = 'CHILD'
		this.node.value = parent.id
	})

	wrap(input, 'remove', function (cb) {
		this.parent.text('ALONE')
		ct('===', cb.length, 0)
		cb()
	})

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
