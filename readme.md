# attodom

*yet another experimental small DOM component library, <2kb*

• [Why](#why) • [API](#api) • [License](#license)


## Why

* experimenting on different APIs to find the minimal helpers required for
  * dynamic nodes, elements and lists
  * one way data flow from root component to child nodes


### Features

* multiple dynamic lists within the same parent
* svg and namespace support
* ability to inject a `document API` for server use and/or testing (e.g. `jsdom`)
* no virtual DOM, all operations are done on actual nodes
* 1 kb gzip, no dependencies
* Designed for older browsers, low memory requirement and no transpilation required


### Limitations

* view and event helpers only
* limited css utility
* strictly DOM element creation and manipulation (no router, no store)


## API

### Elements (hyperscript)

* `el(tagName [, attributes[, updater [,children]]] ): HTMLElement`
* `svg(tagName [, attributes[, updater [,children]]] ): SVGElement`

where
`attributes: {name: value}`
`updater: function(Node, [*], [*], [*]):Node`
`children: {number|string|Node|Array<children>}`


### Helper Function

`update: function(Node, [*], [*], [*]):Node`
Updates a node with the provided updater defined on creation

`updateChildren: function(ParentNode, [*], [*], [*]):ParentNode`
Updates all children nodes of a parenta node with the provided updater defined on creation


### Lists

* `list(nodeFactory [, getKey]): CommentNode`

where
`nodeFactory: function([*], [*], [*]): Node`
`getKey: function([*], [number], [Array]): string`

list creates a `Comment Node` that will be followed by a variable number of Nodes upon update with an array.


### Server use

Document can be injected as follow:

```javascript
const root = require('attodom/root')
root.document = myDocumentObject
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
