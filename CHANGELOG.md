# Change Log

- based on [Keep a Changelog](http://keepachangelog.com/)
- adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
~~Removed, Changed, Deprecated, Added, Fixed, Security~~

## [0.6.0] - 2018-01-21
### Removed
- component event handling

### Changed
- components no longer exposed. all factories (el, svg, list) return nodes
- a node is a component if it has an updater function

## [0.5.0] - 2018-01-21
### Removed
- `.find`, `.text`

### Changed
- reverted to an hyperscript style API

## [0.4.0] - 2017-06-04
### Removed
- `.wrap`, `.text`, `.id`, `.class` methods
- es6 and browser versions

### Changed
- module system from esm to cjs
- `.set` => `.c`
- `.set` => `.c`
- `setWindow` => `config.document`

## [0.3.0] - 2017-06-04
### Added
- forked from [pico-dom](https://www.npmjs.com/package/pico-dom)
- no templates
- `.wrap` helper
- `.a` short form for attributes
- cElement.id(string)
- setDocument to setWindow
