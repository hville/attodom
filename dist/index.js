/* hugov@runbox.com | https://github.com/hville/attodom.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

exports.D = typeof document !== 'undefined' ? document : null;

/**
* @function setDocument
* @param  {Document} doc DOM document
* @return {Document} DOM document
*/
function setDocument(doc) {
	return exports.D = doc
}

var attoKey = '_aD';

/**
 * @constructor
 * @param {!Node} node - DOM node
 */
function CElement(node) {
	this.node = node;
	node[attoKey] = this;
}

var CElementProto = CElement.prototype = {
	constructor: CElement,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },

	wrap: function(name, action) {
		var method = this.constructor.prototype[name],
				arity = method.length,
				async = (action.length === arity + 1);

		this[name] = function() {
			var len = arguments.length,
					args = Array(arity);

			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null;
			if (async) {
				var ctx = this;
				action.apply(this, args.concat(function() {
					if (arguments.length) throw Error('callback takes no argument')
					method.apply(ctx, args);
				}));
			}
			else {
				action.apply(this, args);
				method.apply(this, args);
			}
			return this
		};

		return this
	},

	/**
	* @function
	* @param  {!Node} parent destination parent
	* @param  {Node} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var node = this.node,
				anchor = before || null;
		if (!parent) throw Error('invalid parent node')

		if (node.parentNode !== parent || (anchor !== node && anchor !== node.nextSibling)) {
			parent.insertBefore(node, anchor);
		}
		return this
	},

	/**
	* @function
	* @return {!Object} this
	*/
	remove: function() {
		var node = this.node,
				origin = node.parentNode;
		if (origin) origin.removeChild(node);
		return this
	},

	/**
	 * @function
	 * @param {string|number} key
	 * @param {*} val value
	 * @returns {!Object} this
	 */
	set: function(key, val) {
		this[key] = val;
		return this
	},

	p: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val;
		return this
	},

	text: function(txt) {
		this.node.textContent = txt;
		return this
	},

	a: function(key, val) {
		if (val === false) this.node.removeAttribute(key);
		else this.node.setAttribute(key, val === true ? '' : val);
		return this
	},

	class: function(val) {
		this.node.setAttribute('class', val);
		return this
	},

	child: function(child) {
		var node = this.node;
		if (child === undefined) throw Error('undefined is not a valid child')
		if (child !== null) {
			if (Array.isArray(child)) child.forEach(this.child, this);
			else if (child.moveTo) child.moveTo(node);
			else node.appendChild(
				child.cloneNode ? child.cloneNode(true) : exports.D.createTextNode(''+child)
			);
		}
		return this
	},

	// EVENT LISTENERS
	handlers: null,
	handleEvent: function(event) {
		var handlers = this.handlers,
				handler = handlers && handlers[event.type];
		if (handler) handler.call(this, event);
		else throw Error(event.type + ' handler mismatch')
	},
	on: function(type, handler) {
		if (!handler) {
			if (this.handlers && this.handlers[type]) {
				delete this.handlers[type];
				this.node.removeEventListener(type, this, false);
			}
		}
		else {
			if (!this.handlers) this.handlers = {};
			this.handlers[type] = handler;
			this.node.addEventListener(type, this, false);
		}
		return this
	},

	update: updateChildren,
	updateChildren: updateChildren
};

function updateChildren(v, k, o) {
	var child = this.node.firstChild;
	while (child) {
		var co = child[attoKey];
		if (co) {
			if (co.update) co.update(v, k, o);
			child = (co.foot || child).nextSibling;
		}
		else child = child.nextSibling;
	}
	return this
}

/**
 * @constructor
 * @param {Node} node - DOM node
 */
function CNode(node) {
	this.node = node;
	node[attoKey] = this;
}

CNode.prototype = {
	constructor: CNode,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },
	p: CElementProto.p,
	wrap: CElementProto.wrap,
	set: CElementProto.set,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	text: CElementProto.text,
	update: CElementProto.text
};

/**
 * @constructor
 * @param {!Function} factory
 * @param {Function} [getKey]
 */
function CKeyed(factory, getKey) {
	this.refs = Object.create(null);
	this.factory = factory;
	if (getKey) this.getKey = getKey;

	this.node = exports.D.createComment('^');
	this.foot = exports.D.createComment('$');
	this.node[attoKey] = this;
	this.foot[attoKey] = this;
}

var CKeyedProto = CKeyed.prototype = {
	constructor: CKeyed,
	set: CElementProto.set,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	remove: remove,
	foot: null,


	/**
	* @function moveTo
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
	* @return {!Object} this
	*/
	moveTo: function(parent, before) {
		var foot = this.foot,
				next = this.node,
				origin = next.parentNode,
				anchor = before || null;

		if (!parent.nodeType) throw Error('invalid parent node')

		if (origin !== parent || (anchor !== foot && anchor !== foot.nextSibling)) {

			if (origin) { // relocate
				var cursor;
				do next = (cursor = next).nextSibling;
				while (parent.insertBefore(cursor, anchor) !== foot)
			}
			else { // insertion
				parent.insertBefore(next, anchor);
				parent.insertBefore(foot, anchor);
			}
		}
		return this
	},

	_placeItem: function(parent, item, spot, foot) {
		if (!spot) item.moveTo(parent);
		else if (item.node === spot.nextSibling) spot[attoKey].moveTo(parent, foot);
		else if (item.node !== spot) item.moveTo(parent, spot);
		return item.foot || item.node
	},

	getKey: function(v,i,a) { //eslint-disable-line no-unused-vars
		return i  // default: indexed
	},

	update: updateKeyedChildren,
	updateChildren: updateKeyedChildren,
};

/**
* @function remove
* @return {!Object} this
*/
function remove() {
	var head = this.node,
			origin = head.parentNode,
			spot = head.nextSibling;

	if (origin) {
		while (spot !== this.foot) {
			var item = spot[attoKey];
			spot = (item.foot || item.node).nextSibling;
			item.remove();
		}
		origin.removeChild(this.foot);
		origin.removeChild(head);
	}

	return this
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			refs = Object.create(null);
	if (!parent) throw Error('list update requires a parent node')
	for (var i = 0; i < arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				item = refs[key] = items[key] || this.factory(key, arr[i], i, arr);
		// place before update since lists require a parent before update
		spot = this._placeItem(parent, item, spot, foot).nextSibling;
		if (item.update) item.update(arr[i], i, arr);
	}
	this.refs = refs;

	while (spot !== this.foot) {
		item = spot[attoKey];
		spot = (item.foot || item.node).nextSibling;
		item.remove();
	}

	return this
}

/**
 * @constructor
 * @param {!Object} items
 * @param {Function} [select]
 */
function CSelect(items, select) {
	this.refs = items;
	if (select) this.select = select;

	this.node = exports.D.createComment('^');
	this.foot = exports.D.createComment('$');
	this.node[attoKey] = this;
	this.foot[attoKey] = this;
}

CSelect.prototype = {
	constructor: CSelect,

/**
 * select all by default
 * @function
 * @param {...*} [v]
 * @return {!Array}
 */
	select: function (v) { //eslint-disable-line no-unused-vars
		return Object.keys(this.refs)
	},

	set: CElementProto.set,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	foot: null,
	remove: CKeyedProto.remove,
	moveTo: CKeyedProto.moveTo,
	_placeItem: CKeyedProto._placeItem,
	update: updateSelectChildren,
	updateChildren: updateSelectChildren
};

function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o);
	if (!parent) throw Error('select update requires a parent node')
	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]];
		if (item) {
			// place before update since lists require a parent before update
			spot = this._placeItem(parent, item, spot, foot).nextSibling;
			if (item.update) item.update(v,k,o);
		}
	}
	while (spot !== this.foot) {
		item = spot[attoKey];
		spot = (item.foot || item.node).nextSibling;
		item.remove();
	}
	return this
}

var svgURI = 'http://www.w3.org/2000/svg';

/**
 * @function svg
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
function svg(tag) {
	return new CElement(exports.D.createElementNS(svgURI, tag))
}

/**
 * @function element
 * @param {!string} tagName tagName
 * @return {!Object} Component
 */
function element(tagName) {
	return new CElement(exports.D.createElement(tagName))
}

/**
 * @function elementNS
 * @param {!string} nsURI namespace URI
 * @param {!string} tag tagName
 * @return {!Object} Component
 */
function elementNS(nsURI, tag) {
	return new CElement(exports.D.createElementNS(nsURI, tag))
}

/**
 * @function text
 * @param {!string} txt textContent
 * @return {!Object} Component
 */
function text(txt) {
	return new CNode(exports.D.createTextNode(txt))
}

/**
 * @function component
 * @param {!Node} node
 * @return {!Object} Component
 */
function component(node) {
	// destroy existing component if any
	if (node[attoKey]) node[attoKey].node = null;
	return node.nodeType === 1 ? new CElement(node) : new CNode(node)
}

/**
 * @function fragment
 * @return {!Object} Component
 */


/**
 * @function
 * @param {!Function} factory
 * @param {Function} [getKey]
 * @return {!Object} Component
 */
function list(factory, getKey) {
	return new CKeyed(factory, getKey)
}

/**
 * @function
 * @param {!Object|!Array} items
 * @param {Function} [getKeys]
 * @return {!Object} Component
 */
function select(items, getKeys) {
	return new CSelect(items, getKeys)
}

function find(start, test, until) { //find(test, head=body, foot=null)
	var spot = start.node || start,
			last = until ? (until.node || until.foot || until) : null,
			comp = spot[attoKey];

	while(!comp || (test && !test(comp))) {
		if (spot === last) return null // specified end reached

		var next = spot.firstChild;
		// if no child get sibling, if no sibling, retry with parent
		if (!next) while(!(next = spot.nextSibling)) {
			spot = spot.parentNode;
			if (spot === null) return null // end of tree reached
		}
		spot = next;
		comp = spot[attoKey];
	}
	return comp
}

var sheet = null;

function css$$1(cssRuleText) {
	(sheet || getSheet()).insertRule(
		cssRuleText,
		sheet.cssRules.length
	);
}

function getSheet() {
	var sheets = exports.D.styleSheets,
			media = /^$|^all$/; //mediaTypes: all, print, screen, speach

	// get existing sheet
	for (var i=0; i<sheets.length; ++i) {
		sheet = sheets[i];
		if (media.test(sheet.media.mediaText) && !sheet.disabled) return sheet
	}
	// or create a new one
	return sheet = exports.D.head.appendChild(exports.D.createElement('style')).sheet
}

// @ts-check

// create template

exports.text = text;
exports.element = element;
exports.svg = svg;
exports.elementNS = elementNS;
exports.list = list;
exports.select = select;
exports.component = component;
exports.setDocument = setDocument;
exports.find = find;
exports.css = css$$1;
