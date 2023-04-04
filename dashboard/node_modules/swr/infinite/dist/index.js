Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var useSWR = require('swr');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var useSWR__default = /*#__PURE__*/_interopDefaultLegacy(useSWR);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var noop = function () { };
// Using noop() as the undefined value as undefined can possibly be replaced
// by something else.  Prettier ignore and extra parentheses are necessary here
// to ensure that tsc doesn't remove the __NOINLINE__ comment.
// prettier-ignore
var UNDEFINED = ( /*#__NOINLINE__*/noop());
var OBJECT = Object;
var isUndefined = function (v) { return v === UNDEFINED; };
var isFunction = function (v) { return typeof v == 'function'; };
var STR_UNDEFINED = 'undefined';
// NOTE: Use function to guarantee it's re-evaluated between jsdom and node runtime for tests.
var hasWindow = function () { return typeof window != STR_UNDEFINED; };

var IS_SERVER = !hasWindow() || 'Deno' in window;
// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
var useIsomorphicLayoutEffect = IS_SERVER ? react.useEffect : react.useLayoutEffect;

// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hashtable under the hood, so the lookup
// complexity is almost O(1).
var table = new WeakMap();
// counter of the key
var counter = 0;
// A stable hash implementation that supports:
// - Fast and ensures unique hash properties
// - Handles unserializable values
// - Handles object key ordering
// - Generates short results
//
// This is not a serialization function, and the result is not guaranteed to be
// parsible.
var stableHash = function (arg) {
    var type = typeof arg;
    var constructor = arg && arg.constructor;
    var isDate = constructor == Date;
    var result;
    var index;
    if (OBJECT(arg) === arg && !isDate && constructor != RegExp) {
        // Object/function, not null/date/regexp. Use WeakMap to store the id first.
        // If it's already hashed, directly return the result.
        result = table.get(arg);
        if (result)
            return result;
        // Store the hash first for circular reference detection before entering the
        // recursive `stableHash` calls.
        // For other objects like set and map, we use this id directly as the hash.
        result = ++counter + '~';
        table.set(arg, result);
        if (constructor == Array) {
            // Array.
            result = '@';
            for (index = 0; index < arg.length; index++) {
                result += stableHash(arg[index]) + ',';
            }
            table.set(arg, result);
        }
        if (constructor == OBJECT) {
            // Object, sort keys.
            result = '#';
            var keys = OBJECT.keys(arg).sort();
            while (!isUndefined((index = keys.pop()))) {
                if (!isUndefined(arg[index])) {
                    result += index + ':' + stableHash(arg[index]) + ',';
                }
            }
            table.set(arg, result);
        }
    }
    else {
        result = isDate
            ? arg.toJSON()
            : type == 'symbol'
                ? arg.toString()
                : type == 'string'
                    ? JSON.stringify(arg)
                    : '' + arg;
    }
    return result;
};

var serialize = function (key) {
    if (isFunction(key)) {
        try {
            key = key();
        }
        catch (err) {
            // dependencies not ready
            key = '';
        }
    }
    var args = [].concat(key);
    // If key is not falsy, or not an empty array, hash it.
    key =
        typeof key == 'string'
            ? key
            : (Array.isArray(key) ? key.length : key)
                ? stableHash(key)
                : '';
    var infoKey = key ? '$swr$' + key : '';
    return [key, args, infoKey];
};

var normalize = function (args) {
    return isFunction(args[1])
        ? [args[0], args[1], args[2] || {}]
        : [args[0], null, (args[1] === null ? args[2] : args[1]) || {}];
};

// Create a custom hook with a middleware
var withMiddleware = function (useSWR, middleware) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = normalize(args), key = _a[0], fn = _a[1], config = _a[2];
        var uses = (config.use || []).concat(middleware);
        return useSWR(key, fn, __assign(__assign({}, config), { use: uses }));
    };
};

// We have to several type castings here because `useSWRInfinite` is a special
var INFINITE_PREFIX = '$inf$';
var getFirstPageKey = function (getKey) {
    return serialize(getKey ? getKey(0, null) : null)[0];
};
var unstable_serialize = function (getKey) {
    return INFINITE_PREFIX + getFirstPageKey(getKey);
};
var infinite = (function (useSWRNext) {
    return function (getKey, fn, config) {
        var rerender = react.useState({})[1];
        var didMountRef = react.useRef(false);
        var dataRef = react.useRef();
        var cache = config.cache, _a = config.initialSize, initialSize = _a === void 0 ? 1 : _a, _b = config.revalidateAll, revalidateAll = _b === void 0 ? false : _b, _c = config.persistSize, persistSize = _c === void 0 ? false : _c, _d = config.revalidateFirstPage, revalidateFirstPage = _d === void 0 ? true : _d, _e = config.revalidateOnMount, revalidateOnMount = _e === void 0 ? false : _e;
        // The serialized key of the first page.
        var firstPageKey = null;
        try {
            firstPageKey = getFirstPageKey(getKey);
        }
        catch (err) {
            // not ready
        }
        // We use cache to pass extra info (context) to fetcher so it can be globally
        // shared. The key of the context data is based on the first page key.
        var contextCacheKey = null;
        // Page size is also cached to share the page data between hooks with the
        // same key.
        var pageSizeCacheKey = null;
        if (firstPageKey) {
            contextCacheKey = '$ctx$' + firstPageKey;
            pageSizeCacheKey = '$len$' + firstPageKey;
        }
        var resolvePageSize = react.useCallback(function () {
            var cachedPageSize = cache.get(pageSizeCacheKey);
            return isUndefined(cachedPageSize) ? initialSize : cachedPageSize;
            // `cache` isn't allowed to change during the lifecycle
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [pageSizeCacheKey, initialSize]);
        // keep the last page size to restore it with the persistSize option
        var lastPageSizeRef = react.useRef(resolvePageSize());
        // When the page key changes, we reset the page size if it's not persisted
        useIsomorphicLayoutEffect(function () {
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }
            if (firstPageKey) {
                // If the key has been changed, we keep the current page size if persistSize is enabled
                cache.set(pageSizeCacheKey, persistSize ? lastPageSizeRef.current : initialSize);
            }
            // `initialSize` isn't allowed to change during the lifecycle
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [firstPageKey]);
        // Needs to check didMountRef during mounting, not in the fetcher
        var shouldRevalidateOnMount = revalidateOnMount && !didMountRef.current;
        // Actual SWR hook to load all pages in one fetcher.
        var swr = useSWRNext(firstPageKey ? INFINITE_PREFIX + firstPageKey : null, function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, forceRevalidateAll, originalData, data, pageSize, previousPageData, i, _b, pageKey, pageArgs, pageData, shouldFetchPage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = cache.get(contextCacheKey) || [], forceRevalidateAll = _a[0], originalData = _a[1];
                        data = [];
                        pageSize = resolvePageSize();
                        previousPageData = null;
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < pageSize)) return [3 /*break*/, 5];
                        _b = serialize(getKey(i, previousPageData)), pageKey = _b[0], pageArgs = _b[1];
                        if (!pageKey) {
                            // `pageKey` is falsy, stop fetching new pages.
                            return [3 /*break*/, 5];
                        }
                        pageData = cache.get(pageKey);
                        shouldFetchPage = revalidateAll ||
                            forceRevalidateAll ||
                            isUndefined(pageData) ||
                            (revalidateFirstPage && !i && !isUndefined(dataRef.current)) ||
                            shouldRevalidateOnMount ||
                            (originalData &&
                                !isUndefined(originalData[i]) &&
                                !config.compare(originalData[i], pageData));
                        if (!(fn && shouldFetchPage)) return [3 /*break*/, 3];
                        return [4 /*yield*/, fn.apply(void 0, pageArgs)];
                    case 2:
                        pageData = _c.sent();
                        cache.set(pageKey, pageData);
                        _c.label = 3;
                    case 3:
                        data.push(pageData);
                        previousPageData = pageData;
                        _c.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 1];
                    case 5:
                        // once we executed the data fetching based on the context, clear the context
                        cache.delete(contextCacheKey);
                        // return the data
                        return [2 /*return*/, data];
                }
            });
        }); }, config);
        // update dataRef
        useIsomorphicLayoutEffect(function () {
            dataRef.current = swr.data;
        }, [swr.data]);
        var mutate = react.useCallback(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var data = args[0];
            // Default to true.
            var shouldRevalidate = args[1] !== false;
            // It is possible that the key is still falsy.
            if (!contextCacheKey)
                return;
            if (shouldRevalidate) {
                if (!isUndefined(data)) {
                    // We only revalidate the pages that are changed
                    var originalData = dataRef.current;
                    cache.set(contextCacheKey, [false, originalData]);
                }
                else {
                    // Calling `mutate()`, we revalidate all pages
                    cache.set(contextCacheKey, [true]);
                }
            }
            return args.length ? swr.mutate(data, shouldRevalidate) : swr.mutate();
        }, 
        // swr.mutate is always the same reference
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contextCacheKey]);
        // Function to load pages data from the cache based on the page size.
        var resolvePagesFromCache = function (pageSize) {
            // return an array of page data
            var data = [];
            var previousPageData = null;
            for (var i = 0; i < pageSize; ++i) {
                var pageKey = serialize(getKey(i, previousPageData))[0];
                // Get the cached page data.
                var pageData = pageKey ? cache.get(pageKey) : UNDEFINED;
                // Return the current data if we can't get it from the cache.
                if (isUndefined(pageData))
                    return dataRef.current;
                data.push(pageData);
                previousPageData = pageData;
            }
            // Return the data
            return data;
        };
        // Extend the SWR API
        var setSize = react.useCallback(function (arg) {
            // It is possible that the key is still falsy.
            if (!pageSizeCacheKey)
                return;
            var size;
            if (isFunction(arg)) {
                size = arg(resolvePageSize());
            }
            else if (typeof arg == 'number') {
                size = arg;
            }
            if (typeof size != 'number')
                return;
            cache.set(pageSizeCacheKey, size);
            lastPageSizeRef.current = size;
            rerender({});
            return mutate(resolvePagesFromCache(size));
        }, 
        // `cache` and `rerender` isn't allowed to change during the lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pageSizeCacheKey, resolvePageSize, mutate]);
        // Use getter functions to avoid unnecessary re-renders caused by triggering
        // all the getters of the returned swr object.
        return {
            size: resolvePageSize(),
            setSize: setSize,
            mutate: mutate,
            get error() {
                return swr.error;
            },
            get data() {
                return swr.data;
            },
            get isValidating() {
                return swr.isValidating;
            }
        };
    };
});
var index = withMiddleware(useSWR__default['default'], infinite);

exports['default'] = index;
exports.infinite = infinite;
exports.unstable_serialize = unstable_serialize;
