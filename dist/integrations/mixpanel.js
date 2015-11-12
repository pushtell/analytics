/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var alias = __webpack_require__(1);
	var dates = __webpack_require__(9);
	var del = __webpack_require__(13).del;
	var includes = __webpack_require__(14);
	var integration = __webpack_require__(18);
	var iso = __webpack_require__(43);
	var pick = __webpack_require__(44);
	var is = __webpack_require__(10);

	/**
	 * Expose `Mixpanel` integration.
	 */

	var Mixpanel = module.exports = integration('Mixpanel').global('mixpanel').option('increments', []).option('peopleProperties', []).option('superProperties', []).option('cookieName', '').option('crossSubdomainCookie', false).option('secureCookie', false).option('nameTag', true).option('pageview', false).option('people', false).option('token', '').option('setAllTraitsByDefault', true).option('trackAllPages', false).option('trackNamedPages', true).option('trackCategorizedPages', true).tag('<script src="//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js">');

	/**
	 * Options aliases.
	 */

	var optionsAliases = {
	  cookieName: 'cookie_name',
	  crossSubdomainCookie: 'cross_subdomain_cookie',
	  secureCookie: 'secure_cookie'
	};

	/**
	 * Initialize.
	 *
	 * https://mixpanel.com/help/reference/javascript#installing
	 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.init
	 *
	 * @api public
	 */

	Mixpanel.prototype.initialize = function () {
	  /* eslint-disable */
	  (function (c, a) {
	    window.mixpanel = a;var b, d, h, e;a._i = [];a.init = function (b, c, f) {
	      function d(a, b) {
	        var c = b.split('.');2 == c.length && (a = a[c[0]], b = c[1]);a[b] = function () {
	          a.push([b].concat(Array.prototype.slice.call(arguments, 0)));
	        };
	      }var g = a;'undefined' !== typeof f ? g = a[f] = [] : f = 'mixpanel';g.people = g.people || [];h = ['disable', 'time_event', 'track', 'track_pageview', 'track_links', 'track_forms', 'register', 'register_once', 'unregister', 'identify', 'alias', 'name_tag', 'set_config', 'people.set', 'people.increment', 'people.track_charge', 'people.append', "people.union", "people.track_charge", "people.clear_charges", "people.delete_user"];for (e = 0; e < h.length; e++) d(g, h[e]);a._i.push([b, c, f]);
	    };a.__SV = 1.2;
	  })(document, window.mixpanel || []);
	  /* eslint-enable */
	  this.options.increments = lowercase(this.options.increments);
	  var options = alias(this.options, optionsAliases);
	  window.mixpanel.init(options.token, options);
	  this.load(this.ready);
	};

	/**
	 * Loaded?
	 *
	 * @api private
	 * @return {boolean}
	 */

	Mixpanel.prototype.loaded = function () {
	  return !!(window.mixpanel && window.mixpanel.config);
	};

	/**
	 * Page.
	 *
	 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.track_pageview
	 *
	 * @api public
	 * @param {Page} page
	 */

	Mixpanel.prototype.page = function (page) {
	  var category = page.category();
	  var name = page.fullName();
	  var opts = this.options;

	  // all pages
	  if (opts.trackAllPages) {
	    this.track(page.track());
	  }

	  // categorized pages
	  if (category && opts.trackCategorizedPages) {
	    this.track(page.track(category));
	  }

	  // named pages
	  if (name && opts.trackNamedPages) {
	    this.track(page.track(name));
	  }
	};

	/**
	 * Trait aliases.
	 */

	var traitAliases = {
	  created: '$created',
	  email: '$email',
	  firstName: '$first_name',
	  lastName: '$last_name',
	  lastSeen: '$last_seen',
	  name: '$name',
	  username: '$username',
	  phone: '$phone'
	};

	/**
	 * Identify.
	 *
	 * https://mixpanel.com/help/reference/javascript#super-properties
	 * https://mixpanel.com/help/reference/javascript#user-identity
	 * https://mixpanel.com/help/reference/javascript#storing-user-profiles
	 *
	 * @api public
	 * @param {Identify} identify
	 */

	Mixpanel.prototype.identify = function (identify) {
	  var username = identify.username();
	  var email = identify.email();
	  var id = identify.userId();
	  var setAllTraitsByDefault = this.options.setAllTraitsByDefault;
	  var people = this.options.people;
	  var peopleProperties = extendTraits(this.options.peopleProperties);
	  var superProperties = this.options.superProperties;

	  // id
	  if (id) window.mixpanel.identify(id);

	  // name tag
	  var nametag = email || username || id;
	  if (nametag) window.mixpanel.name_tag(nametag);

	  // default set all traits as super and people properties
	  var traits = identify.traits(traitAliases);
	  if (traits.$created) del(traits, 'createdAt');
	  if (setAllTraitsByDefault) {
	    window.mixpanel.register(dates(traits, iso));
	    if (this.options.people) window.mixpanel.people.set(traits);
	  }

	  // explicitly set select traits as people and super properties
	  var mappedSuperProps = mapTraits(superProperties);
	  var superProps = pick(mappedSuperProps || [], traits);
	  if (!is.empty(superProps)) window.mixpanel.register(superProps);
	  if (people) {
	    var mappedPeopleProps = mapTraits(peopleProperties);
	    var peopleProps = pick(mappedPeopleProps || [], traits);
	    if (!is.empty(peopleProps)) window.mixpanel.people.set(peopleProps);
	  }
	};

	/**
	 * Track.
	 *
	 * https://mixpanel.com/help/reference/javascript#sending-events
	 * https://mixpanel.com/help/reference/javascript#tracking-revenue
	 *
	 * @api public
	 * @param {Track} track
	 */

	Mixpanel.prototype.track = function (track) {
	  var increments = this.options.increments;
	  var increment = track.event().toLowerCase();
	  var people = this.options.people;
	  var props = track.properties();
	  var revenue = track.revenue();
	  // Don't map traits, clients should use identify instead.
	  var superProps = pick(this.options.superProperties, props);

	  // delete mixpanel's reserved properties, so they don't conflict
	  delete props.distinct_id;
	  delete props.ip;
	  delete props.mp_name_tag;
	  delete props.mp_note;
	  delete props.token;

	  // increment properties in mixpanel people
	  if (people && includes(increment, increments)) {
	    window.mixpanel.people.increment(track.event());
	    window.mixpanel.people.set('Last ' + track.event(), new Date());
	  }

	  // track the event
	  props = dates(props, iso);
	  window.mixpanel.track(track.event(), props);

	  // register super properties if present in context.mixpanel.superProperties
	  if (!is.empty(superProps)) {
	    window.mixpanel.register(superProps);
	  }

	  // track revenue specifically
	  if (revenue && people) {
	    window.mixpanel.people.track_charge(revenue);
	  }
	};

	/**
	 * Alias.
	 *
	 * https://mixpanel.com/help/reference/javascript#user-identity
	 * https://mixpanel.com/help/reference/javascript-full-api-reference#mixpanel.alias
	 *
	 * @api public
	 * @param {Alias} alias
	 */

	Mixpanel.prototype.alias = function (alias) {
	  var mp = window.mixpanel;
	  var to = alias.to();
	  if (mp.get_distinct_id && mp.get_distinct_id() === to) return;
	  // HACK: internal mixpanel API to ensure we don't overwrite
	  if (mp.get_property && mp.get_property('$people_distinct_id') === to) return;
	  // although undocumented, mixpanel takes an optional original id
	  mp.alias(to, alias.from());
	};

	/**
	 * Lowercase the given `arr`.
	 *
	 * @api private
	 * @param {Array} arr
	 * @return {Array}
	 */

	function lowercase(arr) {
	  var ret = new Array(arr.length);

	  for (var i = 0; i < arr.length; ++i) {
	    ret[i] = String(arr[i]).toLowerCase();
	  }

	  return ret;
	}

	/**
	 * Map Special traits in the given `arr`.
	 * From the TraitAliases for Mixpanel's special props
	 *
	 * @api private
	 * @param {Array} arr
	 * @return {Array}
	 */

	function mapTraits(arr) {
	  var ret = new Array(arr.length);

	  for (var i = 0; i < arr.length; ++i) {
	    if (traitAliases.hasOwnProperty(arr[i])) {
	      ret.push(traitAliases[arr[i]]);
	    } else {
	      ret.push(arr[i]);
	    }
	  }

	  return ret;
	}

	/**
	 * extend Mixpanel's special trait keys in the given `arr`.
	 *
	 * @api private
	 * @param {Array} arr
	 * @return {Array}
	 */

	function extendTraits(arr) {
	  var keys = [];

	  for (var key in traitAliases) {
	    if (traitAliases.hasOwnProperty(key)) {
	      keys.push(key);
	    }
	  }

	  for (var i = 0; i < keys.length; ++i) {
	    if (arr.indexOf(keys[i]) < 0) {
	      arr.push(keys[i]);
	    }
	  }

	  return arr;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var type = __webpack_require__(2);

	try {
	  var clone = __webpack_require__(7);
	} catch (e) {
	  var clone = __webpack_require__(7);
	}

	/**
	 * Expose `alias`.
	 */

	module.exports = alias;

	/**
	 * Alias an `object`.
	 *
	 * @param {Object} obj
	 * @param {Mixed} method
	 */

	function alias(obj, method) {
	  switch (type(method)) {
	    case 'object':
	      return aliasByDictionary(clone(obj), method);
	    case 'function':
	      return aliasByFunction(clone(obj), method);
	  }
	}

	/**
	 * Convert the keys in an `obj` using a dictionary of `aliases`.
	 *
	 * @param {Object} obj
	 * @param {Object} aliases
	 */

	function aliasByDictionary(obj, aliases) {
	  for (var key in aliases) {
	    if (undefined === obj[key]) continue;
	    obj[aliases[key]] = obj[key];
	    delete obj[key];
	  }
	  return obj;
	}

	/**
	 * Convert the keys in an `obj` using a `convert` function.
	 *
	 * @param {Object} obj
	 * @param {Function} convert
	 */

	function aliasByFunction(obj, convert) {
	  // have to create another object so that ie8 won't infinite loop on keys
	  var output = {};
	  for (var key in obj) output[convert(key)] = obj[key];
	  return output;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function (val) {
	  switch (toString.call(val)) {
	    case '[object Date]':
	      return 'date';
	    case '[object RegExp]':
	      return 'regexp';
	    case '[object Arguments]':
	      return 'arguments';
	    case '[object Array]':
	      return 'array';
	    case '[object Error]':
	      return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  if (typeof Buffer != 'undefined' && Buffer.isBuffer(val)) return 'buffer';

	  val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);

	  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).Buffer))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {'use strict';

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	var base64 = __webpack_require__(4);
	var ieee754 = __webpack_require__(5);
	var isArray = __webpack_require__(6);

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation

	var rootParent = {};

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

	function typedArraySupport() {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
	  } catch (e) {
	    return false;
	  }
	}

	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }

	  this.length = 0;
	  this.parent = undefined;

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }

	  // Unusual.
	  return fromObject(this, arg);
	}

	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}

	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);

	  that.write(string, encoding);
	  return that;
	}

	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);

	  if (isArray(object)) return fromArray(that, object);

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }

	  if (object.length) return fromArrayLike(that, object);

	  return fromJsonObject(that, object);
	}

	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}

	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}

	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;

	  return that;
	}

	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}

	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}

	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};

	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }

	  if (a === b) return 0;

	  var x = a.length;
	  var y = b.length;

	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;

	    ++i;
	  }

	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }

	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};

	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};

	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

	  if (list.length === 0) {
	    return new Buffer(0);
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }

	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};

	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;

	  var len = string.length;
	  if (len === 0) return 0;

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined;
	Buffer.prototype.parent = undefined;

	function slowToString(encoding, start, end) {
	  var loweredCase = false;

	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;

	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);

	      case 'ascii':
	        return asciiSlice(this, start, end);

	      case 'binary':
	        return binarySlice(this, start, end);

	      case 'base64':
	        return base64Slice(this, start, end);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};

	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};

	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};

	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};

	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
	  byteOffset >>= 0;

	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }

	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }

	  throw new TypeError('val must be string, number or Buffer');
	};

	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};

	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};

	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}

	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}

	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}

	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}

	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}

	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}

	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	    // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	      encoding = offset;
	      length = this.length;
	      offset = 0;
	      // Buffer#write(string, offset[, length][, encoding])
	    } else if (isFinite(offset)) {
	        offset = offset | 0;
	        if (isFinite(length)) {
	          length = length | 0;
	          if (encoding === undefined) encoding = 'utf8';
	        } else {
	          encoding = length;
	          length = undefined;
	        }
	        // legacy write(string, encoding, offset, length) - remove in v0.13
	      } else {
	          var swap = encoding;
	          encoding = offset;
	          offset = length | 0;
	          length = swap;
	        }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);

	      case 'ascii':
	        return asciiWrite(this, string, offset, length);

	      case 'binary':
	        return binaryWrite(this, string, offset, length);

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};

	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}

	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res);
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}

	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret;
	}

	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}

	function hexSlice(buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}

	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}

	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this;

	  return newBuf;
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}

	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val;
	};

	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};

	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val;
	};

	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return this[offset];
	  return (0xff - this[offset] + 1) * -1;
	};

	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 0x8000 ? val | 0xFFFF0000 : val;
	};

	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};

	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};

	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};

	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};

	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = value / mul & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength;
	};

	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = value & 0xff;
	  return offset + 1;
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 0xff;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 0xff;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 0xff;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};

	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}

	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};

	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }

	  return len;
	};

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;

	  if (end < start) throw new RangeError('end < start');

	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }

	  return this;
	};

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype;

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;

	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;

	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;

	  return arr;
	};

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}

	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}

	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}

	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue;
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue;
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue;
	      }

	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }

	  return bytes;
	}

	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray;
	}

	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray;
	}

	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}

	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).Buffer, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !!val && '[object Array]' == str.call(val);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var type;

	try {
	  type = __webpack_require__(2);
	} catch (e) {
	  type = __webpack_require__(8);
	}

	/**
	 * Module exports.
	 */

	module.exports = clone;

	/**
	 * Clones objects.
	 *
	 * @param {Mixed} any object
	 * @api public
	 */

	function clone(obj) {
	  switch (type(obj)) {
	    case 'object':
	      var copy = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          copy[key] = clone(obj[key]);
	        }
	      }
	      return copy;

	    case 'array':
	      var copy = new Array(obj.length);
	      for (var i = 0, l = obj.length; i < l; i++) {
	        copy[i] = clone(obj[i]);
	      }
	      return copy;

	    case 'regexp':
	      // from millermedeiros/amd-utils - MIT
	      var flags = '';
	      flags += obj.multiline ? 'm' : '';
	      flags += obj.global ? 'g' : '';
	      flags += obj.ignoreCase ? 'i' : '';
	      return new RegExp(obj.source, flags);

	    case 'date':
	      return new Date(obj.getTime());

	    default:
	      // string, number, boolean, …
	      return obj;
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function (val) {
	  switch (toString.call(val)) {
	    case '[object Function]':
	      return 'function';
	    case '[object Date]':
	      return 'date';
	    case '[object RegExp]':
	      return 'regexp';
	    case '[object Arguments]':
	      return 'arguments';
	    case '[object Array]':
	      return 'array';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val === Object(val)) return 'object';

	  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(10);

	try {
	  var clone = __webpack_require__(7);
	} catch (e) {
	  var clone = __webpack_require__(7);
	}

	/**
	 * Expose `convertDates`.
	 */

	module.exports = convertDates;

	/**
	 * Recursively convert an `obj`'s dates to new values.
	 *
	 * @param {Object} obj
	 * @param {Function} convert
	 * @return {Object}
	 */

	function convertDates(obj, convert) {
	  obj = clone(obj);
	  for (var key in obj) {
	    var val = obj[key];
	    if (is.date(val)) obj[key] = convert(val);
	    if (is.object(val)) obj[key] = convertDates(val, convert);
	  }
	  return obj;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isEmpty = __webpack_require__(11);

	try {
	  var typeOf = __webpack_require__(12);
	} catch (e) {
	  var typeOf = __webpack_require__(12);
	}

	/**
	 * Types.
	 */

	var types = ['arguments', 'array', 'boolean', 'date', 'element', 'function', 'null', 'number', 'object', 'regexp', 'string', 'undefined'];

	/**
	 * Expose type checkers.
	 *
	 * @param {Mixed} value
	 * @return {Boolean}
	 */

	for (var i = 0, type; type = types[i]; i++) exports[type] = generate(type);

	/**
	 * Add alias for `function` for old browsers.
	 */

	exports.fn = exports['function'];

	/**
	 * Expose `empty` check.
	 */

	exports.empty = isEmpty;

	/**
	 * Expose `nan` check.
	 */

	exports.nan = function (val) {
	  return exports.number(val) && val != val;
	};

	/**
	 * Generate a type checker.
	 *
	 * @param {String} type
	 * @return {Function}
	 */

	function generate(type) {
	  return function (value) {
	    return type === typeOf(value);
	  };
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `isEmpty`.
	 */

	module.exports = isEmpty;

	/**
	 * Has.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Test whether a value is "empty".
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 */

	function isEmpty(val) {
	  if (null == val) return true;
	  if ('number' == typeof val) return 0 === val;
	  if (undefined !== val.length) return 0 === val.length;
	  for (var key in val) if (has.call(val, key)) return false;
	  return true;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function (val) {
	  switch (toString.call(val)) {
	    case '[object Date]':
	      return 'date';
	    case '[object RegExp]':
	      return 'regexp';
	    case '[object Arguments]':
	      return 'arguments';
	    case '[object Array]':
	      return 'array';
	    case '[object Error]':
	      return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  if (typeof Buffer != 'undefined' && Buffer.isBuffer(val)) return 'buffer';

	  val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);

	  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).Buffer))

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	var identity = function identity(_) {
	  return _;
	};

	/**
	 * Module exports, export
	 */

	module.exports = multiple(find);
	module.exports.find = module.exports;

	/**
	 * Export the replacement function, return the modified object
	 */

	module.exports.replace = function (obj, key, val, options) {
	  multiple(replace).call(this, obj, key, val, options);
	  return obj;
	};

	/**
	 * Export the delete function, return the modified object
	 */

	module.exports.del = function (obj, key, options) {
	  multiple(del).call(this, obj, key, null, options);
	  return obj;
	};

	/**
	 * Compose applying the function to a nested key
	 */

	function multiple(fn) {
	  return function (obj, path, val, options) {
	    var normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
	    path = normalize(path);

	    var key;
	    var finished = false;

	    while (!finished) loop();

	    function loop() {
	      for (key in obj) {
	        var normalizedKey = normalize(key);
	        if (0 === path.indexOf(normalizedKey)) {
	          var temp = path.substr(normalizedKey.length);
	          if (temp.charAt(0) === '.' || temp.length === 0) {
	            path = temp.substr(1);
	            var child = obj[key];

	            // we're at the end and there is nothing.
	            if (null == child) {
	              finished = true;
	              return;
	            }

	            // we're at the end and there is something.
	            if (!path.length) {
	              finished = true;
	              return;
	            }

	            // step into child
	            obj = child;

	            // but we're done here
	            return;
	          }
	        }
	      }

	      key = undefined;
	      // if we found no matching properties
	      // on the current object, there's no match.
	      finished = true;
	    }

	    if (!key) return;
	    if (null == obj) return obj;

	    // the `obj` and `key` is one above the leaf object and key, so
	    // start object: { a: { 'b.c': 10 } }
	    // end object: { 'b.c': 10 }
	    // end key: 'b.c'
	    // this way, you can do `obj[key]` and get `10`.
	    return fn(obj, key, val);
	  };
	}

	/**
	 * Find an object by its key
	 *
	 * find({ first_name : 'Calvin' }, 'firstName')
	 */

	function find(obj, key) {
	  if (obj.hasOwnProperty(key)) return obj[key];
	}

	/**
	 * Delete a value for a given key
	 *
	 * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
	 */

	function del(obj, key) {
	  if (obj.hasOwnProperty(key)) delete obj[key];
	  return obj;
	}

	/**
	 * Replace an objects existing value with a new one
	 *
	 * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
	 */

	function replace(obj, key, val) {
	  if (obj.hasOwnProperty(key)) obj[key] = val;
	  return obj;
	}

	/**
	 * Normalize a `dot.separated.path`.
	 *
	 * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
	 *
	 * @param {String} path
	 * @return {String}
	 */

	function defaultNormalize(path) {
	  return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
	}

	/**
	 * Check if a value is a function.
	 *
	 * @param {*} val
	 * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
	 */

	function isFunction(val) {
	  return typeof val === 'function';
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Module dependencies.
	 */

	// XXX: Hacky fix for duo not supporting scoped npm packages
	;
	var each;try {
	  each = __webpack_require__(15);
	} catch (e) {
	  each = __webpack_require__(17);
	}

	/**
	 * String#indexOf reference.
	 */

	var strIndexOf = String.prototype.indexOf;

	/**
	 * Object.is/sameValueZero polyfill.
	 *
	 * @api private
	 * @param {*} value1
	 * @param {*} value2
	 * @return {boolean}
	 */

	// TODO: Move to library
	var sameValueZero = function sameValueZero(value1, value2) {
	  // Normal values and check for 0 / -0
	  if (value1 === value2) {
	    return value1 !== 0 || 1 / value1 === 1 / value2;
	  }
	  // NaN
	  return value1 !== value1 && value2 !== value2;
	};

	/**
	 * Searches a given `collection` for a value, returning true if the collection
	 * contains the value and false otherwise. Can search strings, arrays, and
	 * objects.
	 *
	 * @name includes
	 * @api public
	 * @param {*} searchElement The element to search for.
	 * @param {Object|Array|string} collection The collection to search.
	 * @return {boolean}
	 * @example
	 * includes(2, [1, 2, 3]);
	 * //=> true
	 *
	 * includes(4, [1, 2, 3]);
	 * //=> false
	 *
	 * includes(2, { a: 1, b: 2, c: 3 });
	 * //=> true
	 *
	 * includes('a', { a: 1, b: 2, c: 3 });
	 * //=> false
	 *
	 * includes('abc', 'xyzabc opq');
	 * //=> true
	 *
	 * includes('nope', 'xyzabc opq');
	 * //=> false
	 */
	var includes = function includes(searchElement, collection) {
	  var found = false;

	  // Delegate to String.prototype.indexOf when `collection` is a string
	  if (typeof collection === 'string') {
	    return strIndexOf.call(collection, searchElement) !== -1;
	  }

	  // Iterate through enumerable/own array elements and object properties.
	  each(function (value) {
	    if (sameValueZero(value, searchElement)) {
	      found = true;
	      // Exit iteration early when found
	      return false;
	    }
	  }, collection);

	  return found;
	};

	/**
	 * Exports.
	 */

	module.exports = includes;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Module dependencies.
	 */

	// XXX: Hacky fix for Duo not supporting scoped modules
	;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var keys;try {
	  keys = __webpack_require__(16);
	} catch (e) {
	  keys = __webpack_require__(16);
	}

	/**
	 * Object.prototype.toString reference.
	 */

	var objToString = Object.prototype.toString;

	/**
	 * Tests if a value is a number.
	 *
	 * @name isNumber
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
	 */

	// TODO: Move to library
	var isNumber = function isNumber(val) {
	  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	  return type === 'number' || type === 'object' && objToString.call(val) === '[object Number]';
	};

	/**
	 * Tests if a value is an array.
	 *
	 * @name isArray
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
	 */

	// TODO: Move to library
	var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
	  return objToString.call(val) === '[object Array]';
	};

	/**
	 * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
	 * `.length` property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && (isArray(val) || val !== 'function' && isNumber(val.length));
	};

	/**
	 * Internal implementation of `each`. Works on arrays and array-like data structures.
	 *
	 * @name arrayEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array} array The array(-like) structure to iterate over.
	 * @return {undefined}
	 */

	var arrayEach = function arrayEach(iterator, array) {
	  for (var i = 0; i < array.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(array[i], i, array) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Internal implementation of `each`. Works on objects.
	 *
	 * @name baseEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Object} object The object to iterate over.
	 * @return {undefined}
	 */

	var baseEach = function baseEach(iterator, object) {
	  var ks = keys(object);

	  for (var i = 0; i < ks.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(object[ks[i]], ks[i], object) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Iterate over an input collection, invoking an `iterator` function for each element in the
	 * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
	 * function can end iteration early by returning `false`.
	 *
	 * @name each
	 * @api public
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
	 * @example
	 * var log = console.log.bind(console);
	 *
	 * each(log, ['a', 'b', 'c']);
	 * //-> 'a', 0, ['a', 'b', 'c']
	 * //-> 'b', 1, ['a', 'b', 'c']
	 * //-> 'c', 2, ['a', 'b', 'c']
	 * //=> undefined
	 *
	 * each(log, 'tim');
	 * //-> 't', 2, 'tim'
	 * //-> 'i', 1, 'tim'
	 * //-> 'm', 0, 'tim'
	 * //=> undefined
	 *
	 * // Note: Iteration order not guaranteed across environments
	 * each(log, { name: 'tim', occupation: 'enchanter' });
	 * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
	 * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
	 * //=> undefined
	 */

	var each = function each(iterator, collection) {
	  return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
	};

	/**
	 * Exports.
	 */

	module.exports = each;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict'

	/**
	 * charAt reference.
	 */

	;
	var strCharAt = String.prototype.charAt;

	/**
	 * Returns the character at a given index.
	 *
	 * @param {string} str
	 * @param {number} index
	 * @return {string|undefined}
	 */

	// TODO: Move to a library
	var charAt = function charAt(str, index) {
	  return strCharAt.call(str, index);
	};

	/**
	 * hasOwnProperty reference.
	 */

	var hop = Object.prototype.hasOwnProperty;

	/**
	 * Object.prototype.toString reference.
	 */

	var toStr = Object.prototype.toString;

	/**
	 * hasOwnProperty, wrapped as a function.
	 *
	 * @name has
	 * @api private
	 * @param {*} context
	 * @param {string|number} prop
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var has = function has(context, prop) {
	  return hop.call(context, prop);
	};

	/**
	 * Returns true if a value is a string, otherwise false.
	 *
	 * @name isString
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var isString = function isString(val) {
	  return toStr.call(val) === '[object String]';
	};

	/**
	 * Returns true if a value is array-like, otherwise false. Array-like means a
	 * value is not null, undefined, or a function, and has a numeric `length`
	 * property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to a library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && typeof val !== 'function' && typeof val.length === 'number';
	};

	/**
	 * indexKeys
	 *
	 * @name indexKeys
	 * @api private
	 * @param {} target
	 * @param {} pred
	 * @return {Array}
	 */

	var indexKeys = function indexKeys(target, pred) {
	  pred = pred || has;
	  var results = [];

	  for (var i = 0, len = target.length; i < len; i += 1) {
	    if (pred(target, i)) {
	      results.push(String(i));
	    }
	  }

	  return results;
	};

	/**
	 * Returns an array of all the owned
	 *
	 * @name objectKeys
	 * @api private
	 * @param {*} target
	 * @param {Function} pred Predicate function used to include/exclude values from
	 * the resulting array.
	 * @return {Array}
	 */

	var objectKeys = function objectKeys(target, pred) {
	  pred = pred || has;
	  var results = [];

	  for (var key in target) {
	    if (pred(target, key)) {
	      results.push(String(key));
	    }
	  }

	  return results;
	};

	/**
	 * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
	 * More permissive than the native `Object.keys` function (non-objects will not throw errors).
	 *
	 * @name keys
	 * @api public
	 * @category Object
	 * @param {Object} source The value to retrieve keys from.
	 * @return {Array} An array containing all the input `source`'s keys.
	 * @example
	 * keys({ likes: 'avocado', hates: 'pineapple' });
	 * //=> ['likes', 'pineapple'];
	 *
	 * // Ignores non-enumerable properties
	 * var hasHiddenKey = { name: 'Tim' };
	 * Object.defineProperty(hasHiddenKey, 'hidden', {
	 *   value: 'i am not enumerable!',
	 *   enumerable: false
	 * })
	 * keys(hasHiddenKey);
	 * //=> ['name'];
	 *
	 * // Works on arrays
	 * keys(['a', 'b', 'c']);
	 * //=> ['0', '1', '2']
	 *
	 * // Skips unpopulated indices in sparse arrays
	 * var arr = [1];
	 * arr[4] = 4;
	 * keys(arr);
	 * //=> ['0', '4']
	 */

	module.exports = function keys(source) {
	  if (source == null) {
	    return [];
	  }

	  // IE6-8 compatibility (string)
	  if (isString(source)) {
	    return indexKeys(source, charAt);
	  }

	  // IE6-8 compatibility (arguments)
	  if (isArrayLike(source)) {
	    return indexKeys(source, has);
	  }

	  return objectKeys(source);
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var type = __webpack_require__(2);

	/**
	 * HOP reference.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Iterate the given `obj` and invoke `fn(val, i)`.
	 *
	 * @param {String|Array|Object} obj
	 * @param {Function} fn
	 * @api public
	 */

	module.exports = function (obj, fn) {
	  switch (type(obj)) {
	    case 'array':
	      return array(obj, fn);
	    case 'object':
	      if ('number' == typeof obj.length) return array(obj, fn);
	      return object(obj, fn);
	    case 'string':
	      return string(obj, fn);
	  }
	};

	/**
	 * Iterate string chars.
	 *
	 * @param {String} obj
	 * @param {Function} fn
	 * @api private
	 */

	function string(obj, fn) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn(obj.charAt(i), i);
	  }
	}

	/**
	 * Iterate object keys.
	 *
	 * @param {Object} obj
	 * @param {Function} fn
	 * @api private
	 */

	function object(obj, fn) {
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      fn(key, obj[key]);
	    }
	  }
	}

	/**
	 * Iterate array-ish.
	 *
	 * @param {Array|Object} obj
	 * @param {Function} fn
	 * @api private
	 */

	function array(obj, fn) {
	  for (var i = 0; i < obj.length; ++i) {
	    fn(obj[i], i);
	  }
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var bind = __webpack_require__(19);
	var clone = __webpack_require__(7);
	var debug = __webpack_require__(23);
	var defaults = __webpack_require__(24);
	var extend = __webpack_require__(25);
	var slug = __webpack_require__(26);
	var protos = __webpack_require__(27);
	var statics = __webpack_require__(41);

	/**
	 * Create a new `Integration` constructor.
	 *
	 * @constructs Integration
	 * @param {string} name
	 * @return {Function} Integration
	 */

	function createIntegration(name) {
	  /**
	   * Initialize a new `Integration`.
	   *
	   * @class
	   * @param {Object} options
	   */

	  function Integration(options) {
	    if (options && options.addIntegration) {
	      // plugin
	      return options.addIntegration(Integration);
	    }
	    this.debug = debug('analytics:integration:' + slug(name));
	    this.options = defaults(clone(options) || {}, this.defaults);
	    this._queue = [];
	    this.once('ready', bind(this, this.flush));

	    Integration.emit('construct', this);
	    this.ready = bind(this, this.ready);
	    this._wrapInitialize();
	    this._wrapPage();
	    this._wrapTrack();
	  }

	  Integration.prototype.defaults = {};
	  Integration.prototype.globals = [];
	  Integration.prototype.templates = {};
	  Integration.prototype.name = name;
	  extend(Integration, statics);
	  extend(Integration.prototype, protos);

	  return Integration;
	}

	/**
	 * Exports.
	 */

	module.exports = createIntegration;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	try {
	  var bind = __webpack_require__(19);
	} catch (e) {
	  var bind = __webpack_require__(20);
	}

	var bindAll = __webpack_require__(21);

	/**
	 * Expose `bind`.
	 */

	module.exports = exports = bind;

	/**
	 * Expose `bindAll`.
	 */

	exports.all = bindAll;

	/**
	 * Expose `bindMethods`.
	 */

	exports.methods = bindMethods;

	/**
	 * Bind `methods` on `obj` to always be called with the `obj` as context.
	 *
	 * @param {Object} obj
	 * @param {String} methods...
	 */

	function bindMethods(obj, methods) {
	  methods = [].slice.call(arguments, 1);
	  for (var i = 0, method; method = methods[i]; i++) {
	    obj[method] = bind(obj, obj[method]);
	  }
	  return obj;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Slice reference.
	 */

	var slice = [].slice;

	/**
	 * Bind `obj` to `fn`.
	 *
	 * @param {Object} obj
	 * @param {Function|String} fn or string
	 * @return {Function}
	 * @api public
	 */

	module.exports = function (obj, fn) {
	  if ('string' == typeof fn) fn = obj[fn];
	  if ('function' != typeof fn) throw new Error('bind() requires a function');
	  var args = [].slice.call(arguments, 2);
	  return function () {
	    return fn.apply(obj, args.concat(slice.call(arguments)));
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	try {
	  var bind = __webpack_require__(19);
	  var type = __webpack_require__(2);
	} catch (e) {
	  var bind = __webpack_require__(20);
	  var type = __webpack_require__(22);
	}

	module.exports = function (obj) {
	  for (var key in obj) {
	    var val = obj[key];
	    if (type(val) === 'function') obj[key] = bind(obj, obj[key]);
	  }
	  return obj;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function (val) {
	  switch (toString.call(val)) {
	    case '[object Function]':
	      return 'function';
	    case '[object Date]':
	      return 'date';
	    case '[object RegExp]':
	      return 'regexp';
	    case '[object Arguments]':
	      return 'arguments';
	    case '[object Array]':
	      return 'array';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val === Object(val)) return 'object';

	  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `debug()` as the module.
	 */

	module.exports = debug;

	/**
	 * Create a debugger with the given `name`.
	 *
	 * @param {String} name
	 * @return {Type}
	 * @api public
	 */

	function debug(name) {
	  if (!debug.enabled(name)) return function () {};

	  return function (fmt) {
	    fmt = coerce(fmt);

	    var curr = new Date();
	    var ms = curr - (debug[name] || curr);
	    debug[name] = curr;

	    fmt = name + ' ' + fmt + ' +' + debug.humanize(ms);

	    // This hackery is required for IE8
	    // where `console.log` doesn't have 'apply'
	    window.console && console.log && Function.prototype.apply.call(console.log, console, arguments);
	  };
	}

	/**
	 * The currently active debug mode names.
	 */

	debug.names = [];
	debug.skips = [];

	/**
	 * Enables a debug mode by name. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} name
	 * @api public
	 */

	debug.enable = function (name) {
	  try {
	    localStorage.debug = name;
	  } catch (e) {}

	  var split = (name || '').split(/[\s,]+/),
	      len = split.length;

	  for (var i = 0; i < len; i++) {
	    name = split[i].replace('*', '.*?');
	    if (name[0] === '-') {
	      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
	    } else {
	      debug.names.push(new RegExp('^' + name + '$'));
	    }
	  }
	};

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	debug.disable = function () {
	  debug.enable('');
	};

	/**
	 * Humanize the given `ms`.
	 *
	 * @param {Number} m
	 * @return {String}
	 * @api private
	 */

	debug.humanize = function (ms) {
	  var sec = 1000,
	      min = 60 * 1000,
	      hour = 60 * min;

	  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
	  if (ms >= min) return (ms / min).toFixed(1) + 'm';
	  if (ms >= sec) return (ms / sec | 0) + 's';
	  return ms + 'ms';
	};

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	debug.enabled = function (name) {
	  for (var i = 0, len = debug.skips.length; i < len; i++) {
	    if (debug.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (var i = 0, len = debug.names.length; i < len; i++) {
	    if (debug.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * Coerce `val`.
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}

	// persist

	try {
	  if (window.localStorage) debug.enable(localStorage.debug);
	} catch (e) {}

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Expose `defaults`.
	 */
	module.exports = defaults;

	/**
	 * Merge default values.
	 *
	 * @param {Object} dest
	 * @param {Object} defaults
	 * @return {Object}
	 * @api public
	 */
	function defaults(dest, defaults) {
	  for (var prop in defaults) {
	    if (!(prop in dest)) {
	      dest[prop] = defaults[prop];
	    }
	  }

	  return dest;
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function extend(object) {
	    // Takes an unlimited number of extenders.
	    var args = Array.prototype.slice.call(arguments, 1);

	    // For each extender, copy their properties on our object.
	    for (var i = 0, source; source = args[i]; i++) {
	        if (!source) continue;
	        for (var property in source) {
	            object[property] = source[property];
	        }
	    }

	    return object;
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Generate a slug from the given `str`.
	 *
	 * example:
	 *
	 *        generate('foo bar');
	 *        // > foo-bar
	 *
	 * @param {String} str
	 * @param {Object} options
	 * @config {String|RegExp} [replace] characters to replace, defaulted to `/[^a-z0-9]/g`
	 * @config {String} [separator] separator to insert, defaulted to `-`
	 * @return {String}
	 */

	module.exports = function (str, options) {
	  options || (options = {});
	  return str.toLowerCase().replace(options.replace || /[^a-z0-9]/g, ' ').replace(/^ +| +$/g, '').replace(/ +/g, options.separator || '-');
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/* global setInterval:true setTimeout:true */

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(28);
	var after = __webpack_require__(29);
	var each = __webpack_require__(17);
	var events = __webpack_require__(30);
	var fmt = __webpack_require__(31);
	var foldl = __webpack_require__(32);
	var loadIframe = __webpack_require__(34);
	var loadScript = __webpack_require__(35);
	var normalize = __webpack_require__(40);
	var nextTick = __webpack_require__(37);
	var type = __webpack_require__(2);

	/**
	 * Noop.
	 */

	function noop() {}

	/**
	 * hasOwnProperty reference.
	 */

	var has = Object.prototype.hasOwnProperty;

	/**
	 * Window defaults.
	 */

	var onerror = window.onerror;
	var onload = null;
	var setInterval = window.setInterval;
	var setTimeout = window.setTimeout;

	/**
	 * Mixin emitter.
	 */

	/* eslint-disable new-cap */
	Emitter(exports);
	/* eslint-enable new-cap */

	/**
	 * Initialize.
	 */

	exports.initialize = function () {
	  var ready = this.ready;
	  nextTick(ready);
	};

	/**
	 * Loaded?
	 *
	 * @api private
	 * @return {boolean}
	 */

	exports.loaded = function () {
	  return false;
	};

	/**
	 * Page.
	 *
	 * @api public
	 * @param {Page} page
	 */

	/* eslint-disable no-unused-vars */
	exports.page = function (page) {};
	/* eslint-enable no-unused-vars */

	/**
	 * Track.
	 *
	 * @api public
	 * @param {Track} track
	 */

	/* eslint-disable no-unused-vars */
	exports.track = function (track) {};
	/* eslint-enable no-unused-vars */

	/**
	 * Get events that match `event`.
	 *
	 * @api public
	 * @param {Object|Object[]} events An object or array of objects pulled from
	 * settings.mapping.
	 * @param {string} event The name of the event whose metdata we're looking for.
	 * @return {Array} An array of settings that match the input `event` name.
	 * @example
	 * var events = { my_event: 'a4991b88' };
	 * .map(events, 'My Event');
	 * // => ["a4991b88"]
	 * .map(events, 'whatever');
	 * // => []
	 *
	 * var events = [{ key: 'my event', value: '9b5eb1fa' }];
	 * .map(events, 'my_event');
	 * // => ["9b5eb1fa"]
	 * .map(events, 'whatever');
	 * // => []
	 */

	exports.map = function (events, event) {
	  var normalizedEvent = normalize(event);

	  return foldl(function (matchingEvents, val, key, events) {
	    // If true, this is a `mixed` value, which is structured like so:
	    //     { key: 'testEvent', value: { event: 'testEvent', someValue: 'xyz' } }
	    // We need to extract the key, which we use to match against
	    // `normalizedEvent`, and return `value` as part of `matchingEvents` if that
	    // match succeds.
	    if (type(events) === 'array') {
	      // If there's no key attached to this event mapping (unusual), skip this
	      // item.
	      if (!val.key) return matchingEvents;
	      // Extract the key and value from the `mixed` object.
	      key = val.key;
	      val = val.value;
	    }

	    if (normalize(key) === normalizedEvent) {
	      matchingEvents.push(val);
	    }

	    return matchingEvents;
	  }, [], events);
	};

	/**
	 * Invoke a `method` that may or may not exist on the prototype with `args`,
	 * queueing or not depending on whether the integration is "ready". Don't
	 * trust the method call, since it contains integration party code.
	 *
	 * @api private
	 * @param {string} method
	 * @param {...*} args
	 */

	exports.invoke = function (method) {
	  if (!this[method]) return;
	  var args = Array.prototype.slice.call(arguments, 1);
	  if (!this._ready) return this.queue(method, args);
	  var ret;

	  try {
	    this.debug('%s with %o', method, args);
	    ret = this[method].apply(this, args);
	  } catch (e) {
	    this.debug('error %o calling %s with %o', e, method, args);
	  }

	  return ret;
	};

	/**
	 * Queue a `method` with `args`. If the integration assumes an initial
	 * pageview, then let the first call to `page` pass through.
	 *
	 * @api private
	 * @param {string} method
	 * @param {Array} args
	 */

	exports.queue = function (method, args) {
	  if (method === 'page' && this._assumesPageview && !this._initialized) {
	    return this.page.apply(this, args);
	  }

	  this._queue.push({ method: method, args: args });
	};

	/**
	 * Flush the internal queue.
	 *
	 * @api private
	 */

	exports.flush = function () {
	  this._ready = true;
	  var self = this;

	  each(this._queue, function (call) {
	    self[call.method].apply(self, call.args);
	  });

	  // Empty the queue.
	  this._queue.length = 0;
	};

	/**
	 * Reset the integration, removing its global variables.
	 *
	 * @api private
	 */

	exports.reset = function () {
	  for (var i = 0; i < this.globals.length; i++) {
	    window[this.globals[i]] = undefined;
	  }

	  window.setTimeout = setTimeout;
	  window.setInterval = setInterval;
	  window.onerror = onerror;
	  window.onload = onload;
	};

	/**
	 * Load a tag by `name`.
	 *
	 * @param {string} name The name of the tag.
	 * @param {Object} locals Locals used to populate the tag's template variables
	 * (e.g. `userId` in '<img src="https://whatever.com/{{ userId }}">').
	 * @param {Function} [callback=noop] A callback, invoked when the tag finishes
	 * loading.
	 */

	exports.load = function (name, locals, callback) {
	  // Argument shuffling
	  if (typeof name === 'function') {
	    callback = name;locals = null;name = null;
	  }
	  if (name && (typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
	    callback = locals;locals = name;name = null;
	  }
	  if (typeof locals === 'function') {
	    callback = locals;locals = null;
	  }

	  // Default arguments
	  name = name || 'library';
	  locals = locals || {};

	  locals = this.locals(locals);
	  var template = this.templates[name];
	  if (!template) throw new Error(fmt('template "%s" not defined.', name));
	  var attrs = render(template, locals);
	  callback = callback || noop;
	  var self = this;
	  var el;

	  switch (template.type) {
	    case 'img':
	      attrs.width = 1;
	      attrs.height = 1;
	      el = loadImage(attrs, callback);
	      break;
	    case 'script':
	      el = loadScript(attrs, function (err) {
	        if (!err) return callback();
	        self.debug('error loading "%s" error="%s"', self.name, err);
	      });
	      // TODO: hack until refactoring load-script
	      delete attrs.src;
	      each(attrs, function (key, val) {
	        el.setAttribute(key, val);
	      });
	      break;
	    case 'iframe':
	      el = loadIframe(attrs, callback);
	      break;
	    default:
	    // No default case
	  }

	  return el;
	};

	/**
	 * Locals for tag templates.
	 *
	 * By default it includes a cache buster and all of the options.
	 *
	 * @param {Object} [locals]
	 * @return {Object}
	 */

	exports.locals = function (locals) {
	  locals = locals || {};
	  var cache = Math.floor(new Date().getTime() / 3600000);
	  if (!locals.hasOwnProperty('cache')) locals.cache = cache;
	  each(this.options, function (key, val) {
	    if (!locals.hasOwnProperty(key)) locals[key] = val;
	  });
	  return locals;
	};

	/**
	 * Simple way to emit ready.
	 *
	 * @api public
	 */

	exports.ready = function () {
	  this.emit('ready');
	};

	/**
	 * Wrap the initialize method in an exists check, so we don't have to do it for
	 * every single integration.
	 *
	 * @api private
	 */

	exports._wrapInitialize = function () {
	  var initialize = this.initialize;
	  this.initialize = function () {
	    this.debug('initialize');
	    this._initialized = true;
	    var ret = initialize.apply(this, arguments);
	    this.emit('initialize');
	    return ret;
	  };

	  if (this._assumesPageview) this.initialize = after(2, this.initialize);
	};

	/**
	 * Wrap the page method to call `initialize` instead if the integration assumes
	 * a pageview.
	 *
	 * @api private
	 */

	exports._wrapPage = function () {
	  var page = this.page;
	  this.page = function () {
	    if (this._assumesPageview && !this._initialized) {
	      return this.initialize.apply(this, arguments);
	    }

	    return page.apply(this, arguments);
	  };
	};

	/**
	 * Wrap the track method to call other ecommerce methods if available depending
	 * on the `track.event()`.
	 *
	 * @api private
	 */

	exports._wrapTrack = function () {
	  var t = this.track;
	  this.track = function (track) {
	    var event = track.event();
	    var called;
	    var ret;

	    for (var method in events) {
	      if (has.call(events, method)) {
	        var regexp = events[method];
	        if (!this[method]) continue;
	        if (!regexp.test(event)) continue;
	        ret = this[method].apply(this, arguments);
	        called = true;
	        break;
	      }
	    }

	    if (!called) ret = t.apply(this, arguments);
	    return ret;
	  };
	};

	/**
	 * TODO: Document me
	 *
	 * @api private
	 * @param {Object} attrs
	 * @param {Function} fn
	 * @return {undefined}
	 */

	function loadImage(attrs, fn) {
	  fn = fn || function () {};
	  var img = new Image();
	  img.onerror = error(fn, 'failed to load pixel', img);
	  img.onload = function () {
	    fn();
	  };
	  img.src = attrs.src;
	  img.width = 1;
	  img.height = 1;
	  return img;
	}

	/**
	 * TODO: Document me
	 *
	 * @api private
	 * @param {Function} fn
	 * @param {string} message
	 * @param {Element} img
	 * @return {Function}
	 */

	function error(fn, message, img) {
	  return function (e) {
	    e = e || window.event;
	    var err = new Error(message);
	    err.event = e;
	    err.source = img;
	    fn(err);
	  };
	}

	/**
	 * Render template + locals into an `attrs` object.
	 *
	 * @api private
	 * @param {Object} template
	 * @param {Object} locals
	 * @return {Object}
	 */

	function render(template, locals) {
	  return foldl(function (attrs, val, key) {
	    attrs[key] = val.replace(/\{\{\ *(\w+)\ *\}\}/g, function (_, $1) {
	      return locals[$1];
	    });
	    return attrs;
	  }, {}, template.attrs);
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function (event, fn) {
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function (event) {
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1),
	      callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function (event) {
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function (event) {
	  return !!this.listeners(event).length;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function after(times, func) {
	  // After 0, really?
	  if (times <= 0) return func();

	  // That's more like it.
	  return function () {
	    if (--times < 1) {
	      return func.apply(this, arguments);
	    }
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  removedProduct: /^[ _]?removed[ _]?product[ _]?$/i,
	  viewedProduct: /^[ _]?viewed[ _]?product[ _]?$/i,
	  viewedProductCategory: /^[ _]?viewed[ _]?product[ _]?category[ _]?$/i,
	  addedProduct: /^[ _]?added[ _]?product[ _]?$/i,
	  completedOrder: /^[ _]?completed[ _]?order[ _]?$/i,
	  startedOrder: /^[ _]?started[ _]?order[ _]?$/i,
	  updatedOrder: /^[ _]?updated[ _]?order[ _]?$/i,
	  refundedOrder: /^[ _]?refunded?[ _]?order[ _]?$/i,
	  viewedProductDetails: /^[ _]?viewed[ _]?product[ _]?details?[ _]?$/i,
	  clickedProduct: /^[ _]?clicked[ _]?product[ _]?$/i,
	  viewedPromotion: /^[ _]?viewed[ _]?promotion?[ _]?$/i,
	  clickedPromotion: /^[ _]?clicked[ _]?promotion?[ _]?$/i,
	  viewedCheckoutStep: /^[ _]?viewed[ _]?checkout[ _]?step[ _]?$/i,
	  completedCheckoutStep: /^[ _]?completed[ _]?checkout[ _]?step[ _]?$/i
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * toString.
	 */

	var toString = window.JSON ? JSON.stringify : function (_) {
	  return String(_);
	};

	/**
	 * Export `fmt`
	 */

	module.exports = fmt;

	/**
	 * Formatters
	 */

	fmt.o = toString;
	fmt.s = String;
	fmt.d = parseInt;

	/**
	 * Format the given `str`.
	 *
	 * @param {String} str
	 * @param {...} args
	 * @return {String}
	 * @api public
	 */

	function fmt(str) {
	  var args = [].slice.call(arguments, 1);
	  var j = 0;

	  return str.replace(/%([a-z])/gi, function (_, f) {
	    return fmt[f] ? fmt[f](args[j++]) : _ + f;
	  });
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Module dependencies.
	 */

	// XXX: Hacky fix for Duo not supporting scoped modules
	;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var each;try {
	  each = __webpack_require__(33);
	} catch (e) {
	  each = __webpack_require__(17);
	}

	/**
	 * Reduces all the values in a collection down into a single value. Does so by iterating through the
	 * collection from left to right, repeatedly calling an `iterator` function and passing to it four
	 * arguments: `(accumulator, value, index, collection)`.
	 *
	 * Returns the final return value of the `iterator` function.
	 *
	 * @name foldl
	 * @api public
	 * @param {Function} iterator The function to invoke per iteration.
	 * @param {*} accumulator The initial accumulator value, passed to the first invocation of `iterator`.
	 * @param {Array|Object} collection The collection to iterate over.
	 * @return {*} The return value of the final call to `iterator`.
	 * @example
	 * foldl(function(total, n) {
	 *   return total + n;
	 * }, 0, [1, 2, 3]);
	 * //=> 6
	 *
	 * var phonebook = { bob: '555-111-2345', tim: '655-222-6789', sheila: '655-333-1298' };
	 *
	 * foldl(function(results, phoneNumber) {
	 *  if (phoneNumber[0] === '6') {
	 *    return results.concat(phoneNumber);
	 *  }
	 *  return results;
	 * }, [], phonebook);
	 * // => ['655-222-6789', '655-333-1298']
	 */

	var foldl = function foldl(iterator, accumulator, collection) {
	  if (typeof iterator !== 'function') {
	    throw new TypeError('Expected a function but received a ' + (typeof iterator === 'undefined' ? 'undefined' : _typeof(iterator)));
	  }

	  each(function (val, i, collection) {
	    accumulator = iterator(accumulator, val, i, collection);
	  }, collection);

	  return accumulator;
	};

	/**
	 * Exports.
	 */

	module.exports = foldl;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Module dependencies.
	 */

	// XXX: Hacky fix for Duo not supporting scoped modules
	;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var keys;try {
	  keys = __webpack_require__(16);
	} catch (e) {
	  keys = __webpack_require__(16);
	}

	/**
	 * Object.prototype.toString reference.
	 */

	var objToString = Object.prototype.toString;

	/**
	 * Tests if a value is a number.
	 *
	 * @name isNumber
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
	 */

	// TODO: Move to library
	var isNumber = function isNumber(val) {
	  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	  return type === 'number' || type === 'object' && objToString.call(val) === '[object Number]';
	};

	/**
	 * Tests if a value is an array.
	 *
	 * @name isArray
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
	 */

	// TODO: Move to library
	var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
	  return objToString.call(val) === '[object Array]';
	};

	/**
	 * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
	 * `.length` property.
	 *
	 * @name isArrayLike
	 * @api private
	 * @param {*} val
	 * @return {boolean}
	 */

	// TODO: Move to library
	var isArrayLike = function isArrayLike(val) {
	  return val != null && (isArray(val) || val !== 'function' && isNumber(val.length));
	};

	/**
	 * Internal implementation of `each`. Works on arrays and array-like data structures.
	 *
	 * @name arrayEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array} array The array(-like) structure to iterate over.
	 * @return {undefined}
	 */

	var arrayEach = function arrayEach(iterator, array) {
	  for (var i = 0; i < array.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(array[i], i, array) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Internal implementation of `each`. Works on objects.
	 *
	 * @name baseEach
	 * @api private
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Object} object The object to iterate over.
	 * @return {undefined}
	 */

	var baseEach = function baseEach(iterator, object) {
	  var ks = keys(object);

	  for (var i = 0; i < ks.length; i += 1) {
	    // Break iteration early if `iterator` returns `false`
	    if (iterator(object[ks[i]], ks[i], object) === false) {
	      break;
	    }
	  }
	};

	/**
	 * Iterate over an input collection, invoking an `iterator` function for each element in the
	 * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
	 * function can end iteration early by returning `false`.
	 *
	 * @name each
	 * @api public
	 * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
	 * @example
	 * var log = console.log.bind(console);
	 *
	 * each(log, ['a', 'b', 'c']);
	 * //-> 'a', 0, ['a', 'b', 'c']
	 * //-> 'b', 1, ['a', 'b', 'c']
	 * //-> 'c', 2, ['a', 'b', 'c']
	 * //=> undefined
	 *
	 * each(log, 'tim');
	 * //-> 't', 2, 'tim'
	 * //-> 'i', 1, 'tim'
	 * //-> 'm', 0, 'tim'
	 * //=> undefined
	 *
	 * // Note: Iteration order not guaranteed across environments
	 * each(log, { name: 'tim', occupation: 'enchanter' });
	 * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
	 * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
	 * //=> undefined
	 */

	var each = function each(iterator, collection) {
	  return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
	};

	/**
	 * Exports.
	 */

	module.exports = each;

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Expose `after`.
	 */

	module.exports = after;

	/**
	 * Return the `fn` wrapped in logic that will only let it be called after
	 * it has been invoked a certain number of `times`.
	 *
	 * @param {Number} times
	 * @param {Function} fn
	 */

	function after(times, fn) {
	  return function () {
	    if (--times < 1) return fn.apply(this, arguments);
	  };
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var onload = __webpack_require__(36);
	var tick = __webpack_require__(37);
	var type = __webpack_require__(2);

	/**
	 * Expose `loadScript`.
	 *
	 * @param {Object} options
	 * @param {Function} fn
	 * @api public
	 */

	module.exports = function loadScript(options, fn) {
	  if (!options) throw new Error('Cant load nothing...');

	  // Allow for the simplest case, just passing a `src` string.
	  if ('string' == type(options)) options = { src: options };

	  var https = document.location.protocol === 'https:' || document.location.protocol === 'chrome-extension:';

	  // If you use protocol relative URLs, third-party scripts like Google
	  // Analytics break when testing with `file:` so this fixes that.
	  if (options.src && options.src.indexOf('//') === 0) {
	    options.src = https ? 'https:' + options.src : 'http:' + options.src;
	  }

	  // Allow them to pass in different URLs depending on the protocol.
	  if (https && options.https) options.src = options.https;else if (!https && options.http) options.src = options.http;

	  // Make the `<script>` element and insert it before the first script on the
	  // page, which is guaranteed to exist since this Javascript is running.
	  var script = document.createElement('script');
	  script.type = 'text/javascript';
	  script.async = true;
	  script.src = options.src;

	  // If we have a fn, attach event handlers, even in IE. Based off of
	  // the Third-Party Javascript script loading example:
	  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
	  if ('function' == type(fn)) {
	    onload(script, fn);
	  }

	  tick(function () {
	    // Append after event listeners are attached for IE.
	    var firstScript = document.getElementsByTagName('script')[0];
	    firstScript.parentNode.insertBefore(script, firstScript);
	  });

	  // Return the script element in case they want to do anything special, like
	  // give it an ID or attributes.
	  return script;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

	/**
	 * Invoke `fn(err)` when the given `el` script loads.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api public
	 */

	module.exports = function (el, fn) {
	  return el.addEventListener ? add(el, fn) : attach(el, fn);
	};

	/**
	 * Add event listener to `el`, `fn()`.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api private
	 */

	function add(el, fn) {
	  el.addEventListener('load', function (_, e) {
	    fn(null, e);
	  }, false);
	  el.addEventListener('error', function (e) {
	    var err = new Error('script error "' + el.src + '"');
	    err.event = e;
	    fn(err);
	  }, false);
	}

	/**
	 * Attach event.
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @api private
	 */

	function attach(el, fn) {
	  el.attachEvent('onreadystatechange', function (e) {
	    if (!/complete|loaded/.test(el.readyState)) return;
	    fn(null, e);
	  });
	  el.attachEvent('onerror', function (e) {
	    var err = new Error('failed to load the script "' + el.src + '"');
	    err.event = e || window.event;
	    fn(err);
	  });
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process) {"use strict";

	if (typeof setImmediate == 'function') {
	  module.exports = function (f) {
	    setImmediate(f);
	  };
	}
	// legacy node.js
	else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
	    module.exports = process.nextTick;
	  }
	  // fallback for other environments / postMessage behaves badly on IE8
	  else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
	      module.exports = function (f) {
	        setTimeout(f);
	      };
	    } else {
	      var q = [];

	      window.addEventListener('message', function () {
	        var i = 0;
	        while (i < q.length) {
	          try {
	            q[i++]();
	          } catch (e) {
	            q = q.slice(i);
	            window.postMessage('tic!', '*');
	            throw e;
	          }
	        }
	        q.length = 0;
	      }, true);

	      module.exports = function (fn) {
	        if (!q.length) window.postMessage('tic!', '*');
	        q.push(fn);
	      };
	    }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate, __webpack_require__(39)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {"use strict";

	var nextTick = __webpack_require__(39).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function () {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function () {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout = exports.clearInterval = function (timeout) {
	  timeout.close();
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function () {};
	Timeout.prototype.close = function () {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function (item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function (item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function (item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout) item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate, __webpack_require__(38).clearImmediate))

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `toNoCase`.
	 */

	module.exports = toNoCase;

	/**
	 * Test whether a string is camel-case.
	 */

	var hasSpace = /\s/;
	var hasSeparator = /[\W_]/;

	/**
	 * Remove any starting case from a `string`, like camel or snake, but keep
	 * spaces and punctuation that may be important otherwise.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function toNoCase(string) {
	  if (hasSpace.test(string)) return string.toLowerCase();
	  if (hasSeparator.test(string)) return unseparate(string).toLowerCase();
	  return uncamelize(string).toLowerCase();
	}

	/**
	 * Separator splitter.
	 */

	var separatorSplitter = /[\W_]+(.|$)/g;

	/**
	 * Un-separate a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function unseparate(string) {
	  return string.replace(separatorSplitter, function (m, next) {
	    return next ? ' ' + next : '';
	  });
	}

	/**
	 * Camelcase splitter.
	 */

	var camelSplitter = /(.)([A-Z]+)/g;

	/**
	 * Un-camelcase a `string`.
	 *
	 * @param {String} string
	 * @return {String}
	 */

	function uncamelize(string) {
	  return string.replace(camelSplitter, function (m, previous, uppers) {
	    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
	  });
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(28);
	var domify = __webpack_require__(42);
	var each = __webpack_require__(17);
	var includes = __webpack_require__(14);

	/**
	 * Mix in emitter.
	 */

	/* eslint-disable new-cap */
	Emitter(exports);
	/* eslint-enable new-cap */

	/**
	 * Add a new option to the integration by `key` with default `value`.
	 *
	 * @api public
	 * @param {string} key
	 * @param {*} value
	 * @return {Integration}
	 */

	exports.option = function (key, value) {
	  this.prototype.defaults[key] = value;
	  return this;
	};

	/**
	 * Add a new mapping option.
	 *
	 * This will create a method `name` that will return a mapping for you to use.
	 *
	 * @api public
	 * @param {string} name
	 * @return {Integration}
	 * @example
	 * Integration('My Integration')
	 *   .mapping('events');
	 *
	 * new MyIntegration().track('My Event');
	 *
	 * .track = function(track){
	 *   var events = this.events(track.event());
	 *   each(events, send);
	 *  };
	 */

	exports.mapping = function (name) {
	  this.option(name, []);
	  this.prototype[name] = function (str) {
	    return this.map(this.options[name], str);
	  };
	  return this;
	};

	/**
	 * Register a new global variable `key` owned by the integration, which will be
	 * used to test whether the integration is already on the page.
	 *
	 * @api public
	 * @param {string} key
	 * @return {Integration}
	 */

	exports.global = function (key) {
	  this.prototype.globals.push(key);
	  return this;
	};

	/**
	 * Mark the integration as assuming an initial pageview, so to defer loading
	 * the script until the first `page` call, noop the first `initialize`.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.assumesPageview = function () {
	  this.prototype._assumesPageview = true;
	  return this;
	};

	/**
	 * Mark the integration as being "ready" once `load` is called.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.readyOnLoad = function () {
	  this.prototype._readyOnLoad = true;
	  return this;
	};

	/**
	 * Mark the integration as being "ready" once `initialize` is called.
	 *
	 * @api public
	 * @return {Integration}
	 */

	exports.readyOnInitialize = function () {
	  this.prototype._readyOnInitialize = true;
	  return this;
	};

	/**
	 * Define a tag to be loaded.
	 *
	 * @api public
	 * @param {string} [name='library'] A nicename for the tag, commonly used in
	 * #load. Helpful when the integration has multiple tags and you need a way to
	 * specify which of the tags you want to load at a given time.
	 * @param {String} str DOM tag as string or URL.
	 * @return {Integration}
	 */

	exports.tag = function (name, tag) {
	  if (tag == null) {
	    tag = name;
	    name = 'library';
	  }
	  this.prototype.templates[name] = objectify(tag);
	  return this;
	};

	/**
	 * Given a string, give back DOM attributes.
	 *
	 * Do it in a way where the browser doesn't load images or iframes. It turns
	 * out domify will load images/iframes because whenever you construct those
	 * DOM elements, the browser immediately loads them.
	 *
	 * @api private
	 * @param {string} str
	 * @return {Object}
	 */

	function objectify(str) {
	  // replace `src` with `data-src` to prevent image loading
	  str = str.replace(' src="', ' data-src="');

	  var el = domify(str);
	  var attrs = {};

	  each(el.attributes, function (attr) {
	    // then replace it back
	    var name = attr.name === 'data-src' ? 'src' : attr.name;
	    if (!includes(attr.name + '=', str)) return;
	    attrs[name] = attr.value;
	  });

	  return {
	    type: el.tagName.toLowerCase(),
	    attrs: attrs
	  };
	}

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `parse`.
	 */

	module.exports = parse;

	/**
	 * Tests for browser support.
	 */

	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}

	/**
	 * Wrap map from jquery.
	 */

	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};

	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

	map.polyline = map.ellipse = map.polygon = map.circle = map.text = map.line = map.path = map.rect = map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */

	function parse(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');

	  // default to the global `document` object
	  if (!doc) doc = document;

	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);

	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

	  var tag = m[1];

	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }

	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;

	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }

	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }

	  return fragment;
	}

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Expose `toIsoString`.
	 */

	module.exports = toIsoString;

	/**
	 * Turn a `date` into an ISO string.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
	 *
	 * @param {Date} date
	 * @return {String}
	 */

	function toIsoString(date) {
	  return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + '.' + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
	}

	/**
	 * Pad a `number` with a ten's place zero.
	 *
	 * @param {Number} number
	 * @return {String}
	 */

	function pad(number) {
	  var n = number.toString();
	  return n.length === 1 ? '0' + n : n;
	}

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Expose `pick`.
	 */

	module.exports = pick;

	/**
	 * Pick keys from an `obj`.
	 *
	 * @param {Object} obj
	 * @param {Strings} keys...
	 * @return {Object}
	 */

	function pick(obj) {
	  var keys = [].slice.call(arguments, 1);
	  var ret = {};

	  for (var i = 0, key; key = keys[i]; i++) {
	    if (key in obj) ret[key] = obj[key];
	  }

	  return ret;
	}

/***/ }
/******/ ]);