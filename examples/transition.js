import {D, css, select, element as el, list} from '../module'

css('.transitionEx { opacity: 0.5; transition: all 1s ease; }')
css('.transitionIn { opacity: 1.0; transition: all 1s ease; }')

var optionValues = {
	templates: 'immutable template',
	lists: 'select list',
	components: 'dynamic components',
	css: 'css rule insertion',
	transitions: 'css transitions',
	async: 'async operations',
	events: 'event listeners setting and removal'
}

var optionKeys = Object.keys(optionValues)

var options = el('select').class('v-top').a('multiple')
	.a('size', optionKeys.length)
	.on('change', function() { bullets.update() })
	.child(
		select(optionKeys.map(function(k) {
			return el('option').a('selected').text(optionValues[k])
		}))
	).update(optionKeys)

var bullets = el('ol').class('v-top').child(
	list(itemFactory, function(v) {return v})
	.set('update', function() {
		var opts = options.node.options
		for (var i = 0, ks=[]; i < opts.length; ++i) if (opts.item(i).selected) ks.push(opts.item(i).textContent)
		return this.updateChildren(ks)
	})
).update()


function itemFactory() {
	var item = el('li')
	.wrap('moveTo', setClassAfterInsert)
	.wrap('remove', transitionBeforeRemove)
	.set('update', function(v) { return this.text(v) })
	return item
}

// on insert, async change of the class to trigger transition
function setClassAfterInsert() {
	var comp = this
	if (!comp.node.parentNode) {
		comp.class('transitionEx pl5 light-blue')
		D.defaultView.requestAnimationFrame(function() {
			comp.class('transitionIn pl1 dark-blue')
		})
	}
}

// on remove, change the class and wait for transition end before removing
function transitionBeforeRemove(remove) {
	var comp = this
	if (comp.node.parentNode) {
		comp.on('transitionend', function() {
			comp.on('transitionend') //remove the listener
			remove()
		})
		comp.class('transitionIn pl1 dark-blue')
		D.defaultView.requestAnimationFrame(function() {
			comp.class('transitionEx pl5 light-blue')
		})
	}
}

el('div').class('debug').child(
	el('h2').class('pl3').text('example with'),
	el('div').child(
		el('div').class('fl w-50 pa3').child(bullets),
		el('div').class('fl w-50 pa3').child(options)
	)
).moveTo(D.body)
