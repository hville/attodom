# attodom

*yet another experimental small DOM component library, < 1kb*

• [Why](#why) • [API](#api) • [License](#license)


## Why

* experimenting on different APIs to find the minimal helpers required for
  * dynamic nodes, elements and lists
  * one way data flow from root component to child nodes


### Features

* multiple dynamic lists within the same parent
* svg and namespace support
* no virtual DOM, all operations are done on actual nodes
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
* `text(content [, properties ]] ): TextNode`

where
* `attributes: {name: value, update: updateFunction}`
* `children: {number|string|Node|Array<children>}`
* `updateFunction: (this:Node, value:* [, key:* [, object:*]]): void`


### Helper Function

* `updateChildren: function(this:ParentNode, value:* [, key:* [, object:*]]): void`
Updates all children nodes of a parent node


### Lists

* `list(nodeFactory [, getKey]): CommentNode`

where
* `nodeFactory: function(value:* [, key:* [, object:*]]): Node`
* `getKey: string | function([*], [number], [Array]): string`

`list` creates a `Comment Node` that will be followed by a variable number of Nodes upon update with an array.
* If `getKey` is not provided, the list is 'unkeyed' (ie the key is the index)
* If `getKey` is a string, the key is `value[getKey]`
* If `getKey` is a function, the key is `getKey(value, index, array)`

A list can't contain another list

```javascript
var ol = el('ol',
  list((v, i) => el('li', i + ':' + v)),
  {update: updateChildren}
)
ol.update(['a', 'b'])
//=> <ol><#comment><li>1:a</li><li>2:b</li><#comment></ol>
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
