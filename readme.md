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
* less than 1kb gzip, no dependencies
* Designed for phones and/or older browsers:
  * very low memory requirement
  * no transpilation required


### Limitations

* strictly DOM element creation and manipulations (no router, no store)


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

`list` creates a `Comment Node` that will be followed by a variable number of Nodes upon update with an array.
A list can't contain another list

### Server use

Document can be injected as follow:

```javascript
const core = require('attodom/core')
core.document = myDocumentObject
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
