# attodom

*yet another small DOM component library, <2kb*

• [Example](#example) • [Why](#why) • [API](#api) • [License](#license)

## Examples

```javascript
import {D, element as el, list} from '../module'
import {Store} from './Store' // any user store will do
import {ic_remove, ic_add} from './icons'

var store = new Store([])

var table = el('table').child(
  el('caption').class('f4').text('table example with...'),
  el('tbody').child(
    list(function(rowKey) {
      return el('tr').child(
        el('td') //leading column with icon
        .on('click', function() {store.delRow(rowKey) })
        .child(ic_remove),
        list(function(colKey) {
          return el('td') // data columns
          .child(
            el('input')
            .set('update', function(v) { this.node.value = v })
            .on('change', function() {store.set(this.node.value, [rowKey, colKey]) } )
          )
        })
      )
    }),
    el('tr').child(
      el('td')
      .on('click', function() { store.addRow() } )
      .child(ic_add)
    )
  )
)
.moveTo(D.body)

store.onchange = function() { table.update( store.get() ) }
store.set([
  ['icons', 'SVG icons'],
  ['keyed', 'keyed list'],
  ['store', 'data flow'],
  ['event', 'event listeners']
])
```

supports different environments
* CJS: `require('attodom').element`
* ES modules: `import {element} from 'attodom'`
* browser: (`attodom.element`)
* server: See `setDocument` below

Two examples are available:
* `npm run example:table`: dynamic list, 1-way data flow, components, icons
* `npm run example:transition`: select list, transitions


## Why

* experimenting on different APIs to find the minimal helpers required for
  * dynamic nodes, elements and lists
  * one way data flow from root component to child nodes


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

Components can be created with the functions element, elementNS, svg, text, list, select and component

Element
* `element(tagName)`
* `elementNS(nsURI, tagName)`
* `svg(tagName)`
* `component(element)`

Node
* `text(textContent)`
* `component(node)`
* `fragment()`

List (component with multiple or no nodes)
* `list(factory)`
* `select(components)`


Components have a number of chainable methods:
* component properties: `.set(key, val)`
* node properties: `.p(key, val)`
* method wrapper: `.wrap(name, function)`
* node textContent: `.text(key, val)`
* element attributes: `.a(key, val)`
* element id: `.id(string)`
* element class: `.class(string)`
* element child: `.child(node | number | string | Array | null, ...)`
* element event listeners: `.on(name, callback)` to add, `on(name, falsy)` to remove


### List and Select components

`List` and `Select` are special components representing a group of multiple nodes.

`List` take a single factory that will be used to generate list of varying sizes and an optional argument to derive a unique key from individual records
* `list(factory)` to create dynamic indexed set of nodes based on the size of the array upon updates
* `list(factory, function(v) {return v.id}})` for a keyed list
* factory: `(key, val, index, array) => component`

Select lists have predefined components that are used to conditionally display subsets on updates. The optional select function returns the selected keys to show on each updates
* `list({a: componentA, b: componentB}, function(v) {return v ? [a] : [b]})`

lists can be stacked and nested with other components or lists.


#### DOM component properties and methods

* `component.node`: the associated DOM node or comment node anchor node for lists
* `.moveTo(parent [,before])`: to move a component
* `.remove()`: to remove a component from the DOM

#### Component update functions

* `.update(...)` the function to trigger changes based on external data
* `.updateChildren(..)` to pass update data down the tree.

By default, update is set to `text` for text components and `updateChildren` for the other components.

#### Lifecycle events and method wrappers

For additional lifecycle behaviours, component methods can be wrapped (`moveTo`, `remove`). If the arity (number of arguments) of the custom action is greater than the that of the component method, the method will be passed as an argument for async behaviours

* `co.wrap('moveTo', function() { console.log('about to move') })`
* `co.wrap('remove', function(cb) { setTimeout(cb) })`

Wrapper actions are launched before the native method.



### Other helpers

* `setDocument(document)` to set the Document interface for testing or server use
  * eg. `setDocument((new JSDOM).window.document)`
* `D` reference to the Document interface for testing or server use
  * eg. `document.body === D.body`
* `find(from [, test] [, until])` find a component within nodes or components and matching the test function. It parses nodes up and down following the html markup order.
  * eg. `find(document.body)` to get the first component in the document
  * eg. `find(tableComponent, function(c) { return c.key === 5 } )`
* `css(ruleText)` to insert a rule in the document for cases where an exported factory relies on a specific css rule that is not convenient or practical to include in a seperate css file


### Gotcha

* Components may include items that that are not clonable like event listeners and custom properties. As such, they can only be used once. Modules should either export plain nodes (`eg svgElements icons`) or component factory functions.
* `List` and `Select` can't be updated unless they have a parentNode or parent fragment to hold them together.


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
