# attodom

*yet another experimental small DOM component library, < 1kb*

• [Why](#why) • [API](#api) • [License](#license)


## Why

* experimenting on different APIs to find the minimal helpers required for
  * dynamic nodes, elements and lists
  * one way data flow from root component to child nodes


### Features

* multiple dynamic lists within the same parent
* svg support
* no virtual DOM, all operations are done on actual nodes
* synthetic events available
* < 1kb gzip, no dependencies
* Designed for phones and/or older browsers:
  * very low memory requirement
  * no transpilation required


### Limitations

* strictly DOM element creation and manipulations (no router, no store)


## API

### Elements and Nodes (hyperscript)

* `el(tagName [, attributes [,children ]] ): HTMLElement`
* `svg(tagName [, attributes [,children ]] ): SVGElement`

where
* `attributes: {name: value, update: updateFunction}`
* `children: {number|string|Node|Array<children>}`
* `updateFunction: (this:Node, value:* [, key:* [, object:*]]): void`


### Synthetic Events

Synthetic events are used when the first letter of the event name is capitalised
* regular event: `el('h1', {onclick: handler}, 'click me')`
* synthetic event: `el('h1', {onClick: handler}, 'click me')`


### Lists
* `list(parent:Node, factory, options): List`

where
* `factory: function(value:* [, key:* [, object:*]]): Node`
* `options.before: Node`
* `options.after: Node`
* `options.key: string | function([*], [number], [Array]): string`
* `List: {parent, before, after, factory, key, map:{key:Node}, update}`
* `list.update: function([*], [number], [Array]): List`

`list` creates a `List` object with an update method that can update the parent children to match a data Array

```javascript
var ol = el('ol'),
    bullets = list(ol, (v, i) => el('li', i + ':' + v))
bullets.update(['a', 'b'])
// <ol><li>1:a</li><li>2:b</li></ol>
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
