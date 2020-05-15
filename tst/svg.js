import svg from '../svg.js'
import jsdom from 'jsdom'
import t from 'assert-op'

var JSDOM = jsdom.JSDOM
var window = (new JSDOM).window
global.document = window.document

// svg
t('===', svg('svg').nodeType, 1)
t('===', svg('path').nodeType, 1)

t('===', svg('path').attributes.length, 0)
t('===', svg('path', {d: 'm37', stroke: 'green'}).attributes.length, 2)
t('===', svg('path', {d: 'm37'}, {stroke: 'green'}).attributes.length, 2)

t('===', svg('g').childNodes.length, 0)
t('===', svg('svg', svg('g'), svg('g')).childNodes.length, 2)

// svg - event
var kin = svg('path', {onclick: function(e) { this.textContent += e.target.tagName }})
kin.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', kin.textContent, 'path')

// svg - synthetic event
var h2 = svg('path'),
		h1 = svg('svg', {onClick: function(e) { this.textContent = e.target.tagName }}, h2)
document.body.appendChild(h1)
h2.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', h1.textContent, 'path')
h1.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', h1.textContent, 'svg')
