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
* <2kb gzip, no dependencies
* Designed for older browsers, low memory requirement and no transpilation required


### Limitations

* view and event helpers only
* limited css utility
* strictly DOM element creation and manipulation (no router, no store)


## API

### Elements (hyperscript)

* `el(tagName [, attributes [,children]] ): HTMLElement`
* `svg(tagName [, attributes [,children]] ): SVGElement`


### Components

* `co(Element, config, children): Component`
* `.node` the component's associated element
* `.update(value)` the function to trigger changes based on external data
* `.updateChildren(array)` to update all child components

By default, update is set to `updateChildren` for `ParentNodes`, `setValue` form `HTMLInputElement` and `setText` for others.
To change the update function, specify it in the config object `{update: myUpdateFunction}`


### Lists

* `list(componentFactory, getKey)`
List must be added as children to a component to be activated


### Server use

Document can be injected as follow:

```javascript
const root = require('attodom/root')
root.document = myDocumentObject
```

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
