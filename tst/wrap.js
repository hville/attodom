var ct = require('cotest'),
		el = require('../element'),
		wrap = require('../wrap'),
		common = require('../config'),
		JSDOM = require('jsdom').JSDOM

var window = (new JSDOM).window
common.document = window.document

ct('wrap component methods', function(end) {
	var input = el('input'),
			span = el('span'),
			div = el('div').append(span)

	wrap(input, 'moveTo', function(parent, moveTo) {
		parent.id = 'gotChild!'
		this.node.id = 'gotParent!'
		setTimeout(moveTo, 0, parent)
	})

	wrap(span, 'remove', function (remove) {
		this.node.parentNode.id = 'lostChild!'
		this.node.id = 'lostParent!'
		setTimeout(remove, 0)
	})

	div.append(input)

	setTimeout(function() {
		ct('===', input.node.id, 'gotParent!')
		ct('===', div.node.id, 'gotChild!')
		ct('===', span.node.id, '')

		span.remove()

		setTimeout(function() {
			ct('===', div.node.id, 'lostChild!')
			ct('===', span.node.id, 'lostParent!')
			end()
		})
	})
})
