import el from '../el.js'
import jsdom from 'jsdom'
import t from 'assert-op'

var JSDOM = jsdom.JSDOM
var window = (new JSDOM).window
global.document = window.document

// element-nodeType
t('===', el('div').nodeType, 1)
t('===', el('p').nodeType, 1)
t('===', el(document.createElement('p')).nodeType, 1)

// element-properties
t('===', el('div').attributes.length, 0)
t('===', el('div', {id: 'id'}).id, 'id')
t('===', el('div', {className: 'className'}).className, 'className')
t('===', el('input', {value: 'value'}).value, 'value')
t('===', el('p', {textContent: 'textContent'}).textContent, 'textContent')

// element-attributes
t('===', el('div').attributes.length, 0)
t('===', el('div', {class: 'class'}).attributes.length, 1)
t('===', el('div', {style: 'style'}).attributes.length, 1)
t('===', el('div', {'data-set': 'data-set'}).attributes.length, 1)
t('===', el('div', {value: 'value'}).attributes.length, 0)

// element - mixed children
t('===', el('p', [0, el('p'), el('p'), el('p')]).childNodes.length, 4)
t('===', el('p', el('p'), [], el('p'), [el('p'), 0]).childNodes.length, 4)
t('===', el('p', [el('p'), 0, [el('p'), el('p')]]).childNodes.length, 3)

// el - event
var kin = el('h1', {onclick: function(e) { this.textContent += e.target.tagName }})
kin.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', kin.textContent, 'H1')

// el - synthetic event
var h2 = el('h2'),
		h1 = el('h1', {onClick: function(e) { this.textContent = e.target.tagName }}, h2)
document.body.appendChild(h1)
h1.dispatchEvent(new window.Event('click', {bubbles:false}))
t('===', h1.textContent, '')
h2.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', h1.textContent, 'H2')
h1.dispatchEvent(new window.Event('click', {bubbles:true}))
t('===', h1.textContent, 'H1')

// element - update
kin = el('span', 'b', {update: function(v) { this.textContent = v.toUpperCase() }})
t('===', kin.textContent, 'b')
//@ts-ignore
kin.update('abc')
t('===', kin.textContent, 'ABC')

// element - nested reference
var kid = el('span', 'b')
kin = el('h1', el('h2', el('h3', el('h4', kid))), {
	__kid: kid,
	update: function(v) { this.__kid.textContent = v }
})

t('===', kid.textContent, 'b')
//@ts-ignore
kin.update('B')
t('===', kid.textContent, 'B')
