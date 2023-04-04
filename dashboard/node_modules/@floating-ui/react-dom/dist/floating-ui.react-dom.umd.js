(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@floating-ui/dom'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', '@floating-ui/dom', 'react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FloatingUIReactDOM = {}, global.FloatingUIDOM, global.React, global.ReactDOM));
})(this, (function (exports, dom, React, ReactDOM) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespace(React);
  var ReactDOM__namespace = /*#__PURE__*/_interopNamespace(ReactDOM);

  var index = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  // Fork of `fast-deep-equal` that only does the comparisons we need and compares
  // functions
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (typeof a !== typeof b) {
      return false;
    }

    if (typeof a === 'function' && a.toString() === b.toString()) {
      return true;
    }

    let length, i, keys;

    if (a && b && typeof a == 'object') {
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;

        for (i = length; i-- !== 0;) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }

      keys = Object.keys(a);
      length = keys.length;

      if (length !== Object.keys(b).length) {
        return false;
      }

      for (i = length; i-- !== 0;) {
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
          return false;
        }
      }

      for (i = length; i-- !== 0;) {
        const key = keys[i];

        if (key === '_owner' && a.$$typeof) {
          continue;
        }

        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }

      return true;
    }

    return a !== a && b !== b;
  }

  function useLatestRef(value) {
    const ref = React__namespace.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }

  function useFloating(_temp) {
    let {
      middleware,
      placement = 'bottom',
      strategy = 'absolute',
      whileElementsMounted
    } = _temp === void 0 ? {} : _temp;
    const [data, setData] = React__namespace.useState({
      // Setting these to `null` will allow the consumer to determine if
      // `computePosition()` has run yet
      x: null,
      y: null,
      strategy,
      placement,
      middlewareData: {}
    });
    const [latestMiddleware, setLatestMiddleware] = React__namespace.useState(middleware);

    if (!deepEqual(latestMiddleware == null ? void 0 : latestMiddleware.map(_ref => {
      let {
        name,
        options
      } = _ref;
      return {
        name,
        options
      };
    }), middleware == null ? void 0 : middleware.map(_ref2 => {
      let {
        name,
        options
      } = _ref2;
      return {
        name,
        options
      };
    }))) {
      setLatestMiddleware(middleware);
    }

    const reference = React__namespace.useRef(null);
    const floating = React__namespace.useRef(null);
    const cleanupRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef(data);
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const update = React__namespace.useCallback(() => {
      if (!reference.current || !floating.current) {
        return;
      }

      dom.computePosition(reference.current, floating.current, {
        middleware: latestMiddleware,
        placement,
        strategy
      }).then(data => {
        if (isMountedRef.current && !deepEqual(dataRef.current, data)) {
          dataRef.current = data;
          ReactDOM__namespace.flushSync(() => {
            setData(data);
          });
        }
      });
    }, [latestMiddleware, placement, strategy]);
    index(() => {
      // Skip first update
      if (isMountedRef.current) {
        update();
      }
    }, [update]);
    const isMountedRef = React__namespace.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    const runElementMountCallback = React__namespace.useCallback(() => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (reference.current && floating.current) {
        if (whileElementsMountedRef.current) {
          const cleanupFn = whileElementsMountedRef.current(reference.current, floating.current, update);
          cleanupRef.current = cleanupFn;
        } else {
          update();
        }
      }
    }, [update, whileElementsMountedRef]);
    const setReference = React__namespace.useCallback(node => {
      reference.current = node;
      runElementMountCallback();
    }, [runElementMountCallback]);
    const setFloating = React__namespace.useCallback(node => {
      floating.current = node;
      runElementMountCallback();
    }, [runElementMountCallback]);
    const refs = React__namespace.useMemo(() => ({
      reference,
      floating
    }), []);
    return React__namespace.useMemo(() => ({ ...data,
      update,
      refs,
      reference: setReference,
      floating: setFloating
    }), [data, update, refs, setReference, setFloating]);
  }

  /**
   * Positions an inner element of the floating element such that it is centered
   * to the reference element.
   * This wraps the core `arrow` middleware to allow React refs as the element.
   * @see https://floating-ui.com/docs/arrow
   */

  const arrow = options => {
    const {
      element,
      padding
    } = options;

    function isRef(value) {
      return Object.prototype.hasOwnProperty.call(value, 'current');
    }

    return {
      name: 'arrow',
      options,

      fn(args) {
        if (isRef(element)) {
          if (element.current != null) {
            return dom.arrow({
              element: element.current,
              padding
            }).fn(args);
          }

          return {};
        } else if (element) {
          return dom.arrow({
            element,
            padding
          }).fn(args);
        }

        return {};
      }

    };
  };

  exports.arrow = arrow;
  exports.useFloating = useFloating;
  Object.keys(dom).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return dom[k]; }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
