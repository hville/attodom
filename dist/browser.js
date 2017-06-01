/* hugov@runbox.com | https://github.com/hville/attodom.git | license:MIT */
(function (exports) {
'use strict';

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
 * @param {Element} node - DOM node
 */
function CElement(node) {
	this.node = node;
	node[attoKey] = this;
}

var CElementProto = CElement.prototype = {
	constructor: CElement,
	_handlers: null,
	foot: null,
	get parent() { return this.node.parentNode[attoKey] },

	wrap: function(name, action) {
		var method = this[name],
				arity = method.length;

		var async = false;
		if (action.length === arity + 1) async = true;
		else if (action.length !== arity) throw Error(name + 'wrapper arity mimatch')

		this[name] = function() {
			var len = arguments.length,
					args = Array(arity);
			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null;
			if (async) {
				args.push(method.bind(this));
				action.apply(this, args);
			}
			else {
				action.apply(this, args);
				method.apply(this, args);
			}
			return this
		};
		return this
	},

	wrapAsync: function (name, action) {
		var method = this[name],
				arity = method.length;
		if (action.length !== arity + 1) throw Error(name + 'async wrapper arity mimatch')
		this[name] = function () {
			var len = arguments.length,
					args = Array(arity);
			for (var i = 0; i < arity; ++i) args[i] = i < len ? arguments[i] : null;
			action.apply(this, args);
			return method.apply(this, args)
		};
		return this
	},

	/**
	* @function
	* @param  {!Object} parent destination parent
	* @param  {Object} [before] nextSibling
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

	destroy: function() {
		this.remove();
		if (this._handlers) for (var i=0, ks=Object.keys(this._handlers); i<ks.length; ++i) this.on(ks[i], false);
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

	prop: function(key, val) {
		if (this.node[key] !== val) this.node[key] = val;
		return this
	},

	text: function(txt) {
		this.node.textContent = txt;
		return this
	},

	attr: function(key, val) {
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
		if (child != null) {
			if (Array.isArray(child)) child.forEach(this.child, this);
			else if (child.moveTo) child.moveTo(node);
			else node.appendChild(
				child.cloneNode ? child.cloneNode(true) : exports.D.createTextNode(''+child)
			);
		}
		return this
	},

	// EVENT LISTENERS
	handleEvent: function(event) {
		var handlers = this._handlers,
				handler = handlers && handlers[event.type];
		if (handler) handler.call(this, event);
	},

	on: function(type, handler) {
		if (!handler) {
			if (this._handlers && this._handlers[type]) {
				delete this._handlers[type];
				this.node.removeEventListener(type, this, false);
			}
		}
		else {
			if (!this._handlers) this._handlers = {};
			this._handlers[type] = handler;
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
	prop: CElementProto.prop,
	wrap: CElementProto.wrap,
	set: CElementProto.set,
	moveTo: CElementProto.moveTo,
	remove: CElementProto.remove,
	destroy: CElementProto.remove,
	text: nodeValue,
	update: nodeValue
};

function nodeValue(val) {
	this.node.nodeValue = val;
}

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
	prop: CElementProto.prop,
	wrap: CElementProto.wrap,
	get parent() { return this.node.parentNode[attoKey] },
	remove: remove,
	destroy: remove,


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
		if (spot !== this.foot) do {
			var item = this.foot.previousSibling[attoKey];
			item.destroy();
		} while (item !== spot[attoKey])
		origin.removeChild(this.foot);
		origin.removeChild(head);
	}

	return this
}

function updateKeyedChildren(arr) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			refs = Object.create(null);

	for (var i = 0; i < arr.length; ++i) {
		var key = this.getKey(arr[i], i, arr),
				item = refs[key] = items[key] || this.factory(this.config);
		if (item.update) item.update(arr[i], i, arr);
		spot = this._placeItem(parent, item, spot, foot).nextSibling;
	}
	this.refs = refs;

	if (spot !== this.foot) do {
		item = foot.previousSibling[attoKey];
		item.destroy();
	} while (item !== spot[attoKey])

	return this
}

/**
 * @constructor
 * @param {!Object} items
 * @param {Function} [select]
 */
function CSelect(items, select) { //TODO list config vs template config
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
	remove: CKeyedProto.remove,
	destroy: CKeyedProto.remove,
	moveTo: CKeyedProto.moveTo,
	_placeItem: CKeyedProto._placeItem,
	update: updateSelectChildren,
	updateChildren: updateSelectChildren
};


function updateSelectChildren(v,k,o) {
	var foot = this.foot,
			parent = foot.parentNode || this.moveTo(exports.D.createDocumentFragment()).foot.parentNode,
			spot = this.node.nextSibling,
			items = this.refs,
			keys = this.select(v,k,o);

	for (var i=0; i<keys.length; ++i) {
		var item = items[keys[i]];
		if (item) {
			if (item.update) item.update(v,k,o);
			spot = this._placeItem(parent, item, spot, foot).nextSibling;
		}
	}
	if (spot !== this.foot) do {
		item = this.foot.previousSibling[attoKey];
		item.destroy();
	} while (item !== spot[attoKey])
	return this
}

var svgURI = 'http://www.w3.org/2000/svg';


/**
 * @function svg
 * @param {string} tag tagName
 * @return {!Object} Component
 */
function svg(tag) { //eslint-disable-line no-unused-vars
	return new CElement(exports.D.createElementNS(svgURI, tag))
}


/**
 * @function element
 * @param {string} tagName tagName
 * @return {!Object} Component
 */
function element(tagName) { //eslint-disable-line no-unused-vars
	return new CElement(exports.D.createElement(tagName))
}

/**
 * @function elementNS
 * @param {string} nsURI namespace URI
 * @param {string} tag tagName
 * @return {!Object} Component
 */
function elementNS(nsURI, tag) { //eslint-disable-line no-unused-vars
	return new CElement(exports.D.createElementNS(nsURI, tag))
}

/**
 * @function text
 * @param {string} txt textContent
 * @return {!Object} Component
 */
function text(txt) { //eslint-disable-line no-unused-vars
	return new CNode(exports.D.createTextNode(txt))
}


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
exports.setDocument = setDocument;
exports.find = find;
exports.css = css$$1;

}((this.attodom = this.attodom || {})));
