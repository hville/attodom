<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 MD036 -->

# attodom

*yet another small DOM component library*

• [Example](#example) • [Why](#why) • [API](#api) • [License](#license)

## Example

supports different environments
* CJS: `require('attodom').element`
  * can also be used server-side. See `setDocument` below
* ES modules: `import {element} from 'attodom'`
* browser: (`attodom.element`)*

```javascript
import {D, element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'

var store = new Store([]),
		i = 0,
		j = 0

var table = el('table',
	el('caption', {class: 'f4'}, 'table example with...'),
	el('tbody',
		list(
			el('tr',
				function() { i = this.key },
				el('td', //leading column with icon
					function() { this.i = i },
					{ events: { click: function() { this.root.store.delRow(this.i) } } },
					ic_remove
				),
				list( // data columns
					el('td',
						function() { j = this.key },
						el('input',
							function() {
								this.i = i; this.j = j
								this.update = function(v) { this.node.value = v }
								this.event('change', function() {
									this.root.store.set(this.node.value, [this.i, this.j])
								})
							}
						)
					)
				)
			)
		),
		el('tr',
			el('td',
				{ events: {click: function() { this.root.store.addRow() } } },
				ic_add
			)
		)
	)
).extra('store', store)
.moveTo(D.body)

store.onchange = function() { table.update( store.get() ) }
store.set([
	['icons', 'SVG icons'],
	['keyed', 'keyed list'],
	['store', 'data flow'],
	['event', 'event listeners']
])
```

## Why

...experimenting on different APIs


### Features

* dynamic lists and nested lists (keyed, indexed or select)
* svg and namespace support
* ability to inject a `document API` for server use and/or testing (e.g. `jsdom`)
* no virtual DOM, all operations are done on actual nodes
* <2kb gzip, no dependencies, all under 500 lines including comments and jsDocs
* all text injections and manipulations done through the secure `textContent` and `nodeValue` DOM API
* available in CommonJS, ES6 modules and browser versions
* All in ES5 with ES modules, CJS module and iife for browsers. Should work well on mobile and older browsers like IE9.


### Limitations

* view and event helpers only
* limited css utility
* strictly DOM element creation and manipulation (no router, no store)


## API

### Components

Element
* `element(tagName)`
* `elementNS(nsURI, tagName)`
* `svg(tagName)`

Node
* `text(textContent)`

List
* `list(factory)`

Components have a number of chainable methods:
* element attributes: `.attr(key, val)`
* element children: `.append(node | number | string)`
* element event listeners: `.event(name, callback)`
* node properties: `.prop(key, val)`
* component properties: `.extra(key, val)`


### List

List are special components representing a group of multiple nodes.

Resizable lists take a single factory that will be used to generate list of varying sizes
* `list(factory)` to create dynamic indexed set of nodes based on the size of the array upon updates
* `list(factory, factory arguments).extra('getKey', function(v) {return v.id}})` for a keyed list

Select lists have predefined components or factories that are used to conditionally display subsets on updates
* `list({a: factoryA, b: componentB}).extra('select', function(v) {return [v.id]}})` created a conditional list

lists can be stacked and nested.


#### DOM references

* `.node`: the associated DOM node or anchor node for lists

#### DOM functions

* `.moveTo(parent [,before])`: to move a component
* `.remove()`: to remove a component from the DOM
* `.destroy()`: to remove a component and remove listeners

#### Update Functions

* `.text(v)`: to set the node textContent of element Component
* `.update(...)` the function to trigger changes based on external data
* `.updateChildren(..)` to pass update data down the tree.

By default, update is set to `text` for text components and `updateChildren` for the rest.


#### Other

* `.refs`: used in list to hold node references
* `.getKey(val, key, arr) => string`: to get the unique key for keyed lists
* `.select(val, key) => array`: array of keys for conditional/select lists


### Other helpers
* `setDocument(document)` to set the Document interface for testing or server use
  * eg. `setDocument((new JSDOM).window.document)`
* `D` reference to the Document interface for testing or server use
  * eg. `var body = D.body`
* `find(from [, test] [, until])` find a component within nodes or components and matching the test function. It parses nodes up and down following the html markup order.
  * eg. `find(document.body)` to get the first component in the document
  * eg. `find(tableComponent, function(c) { return c.key === 5 } )`
* `css(ruleText)` to insert a rule in the document for cases where an exported factory relies on a specific css rule that is not convenient or practical to include in a seperate css file

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
