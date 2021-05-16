import el from '../el.js'
import find from '../find.js'
import jsdom from 'jsdom'
import t from 'assert-op/assert.js'

var JSDOM = jsdom.JSDOM
var window = (new JSDOM).window
global.document = window.document

// find
var h01 = el('h2', 'H01'),
		h0 = el('h1', ['H0', el('h2', 'H00'), h01]),
		h10 = el('h2', 'H10'),
		h1 = el('h1', 'H1', h10, el('h2', 'H11')),
		h = el('div', ['H', h0, h1])

t('===', find(h, c=>c.textContent === 'H10'), h10)
t('===', find(h, c=>c.textContent === 'H10'), h10)

t('===', find(h, c=>c.textContent === 'H10', h10), h10)
t('===', find(h, c=>c.textContent === 'H10', h10), h10)

t('===', find(h, c=>c.textContent === 'H10', h01), null)
t('===', find(h, c=>c.textContent === 'H10', h01), null)
