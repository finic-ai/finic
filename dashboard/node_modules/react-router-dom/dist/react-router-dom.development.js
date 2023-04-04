/**
 * React Router DOM v6.4.5
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import * as React from 'react';
import { UNSAFE_enhanceManualRouteObjects, Router, useHref, useResolvedPath, useLocation, UNSAFE_DataRouterStateContext, UNSAFE_NavigationContext, useNavigate, createPath, UNSAFE_RouteContext, useMatches, useNavigation, UNSAFE_DataRouterContext } from 'react-router';
export { AbortedDeferredError, Await, MemoryRouter, Navigate, NavigationType, Outlet, Route, Router, RouterProvider, Routes, UNSAFE_DataRouterContext, UNSAFE_DataRouterStateContext, UNSAFE_DataStaticRouterContext, UNSAFE_LocationContext, UNSAFE_NavigationContext, UNSAFE_RouteContext, UNSAFE_enhanceManualRouteObjects, createMemoryRouter, createPath, createRoutesFromChildren, createRoutesFromElements, defer, generatePath, isRouteErrorResponse, json, matchPath, matchRoutes, parsePath, redirect, renderMatches, resolvePath, useActionData, useAsyncError, useAsyncValue, useHref, useInRouterContext, useLoaderData, useLocation, useMatch, useMatches, useNavigate, useNavigation, useNavigationType, useOutlet, useOutletContext, useParams, useResolvedPath, useRevalidator, useRouteError, useRouteLoaderData, useRoutes } from 'react-router';
import { createRouter, createBrowserHistory, createHashHistory, ErrorResponse, invariant, joinPaths } from '@remix-run/router';

const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function shouldProcessLinkClick(event, target) {
  return event.button === 0 && ( // Ignore everything but left clicks
  !target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // Ignore clicks with modifier keys
  ;
}

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
function createSearchParams(init = "") {
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);

  for (let key of defaultSearchParams.keys()) {
    if (!searchParams.has(key)) {
      defaultSearchParams.getAll(key).forEach(value => {
        searchParams.append(key, value);
      });
    }
  }

  return searchParams;
}
function getFormSubmissionInfo(target, defaultAction, options) {
  let method;
  let action;
  let encType;
  let formData;

  if (isFormElement(target)) {
    let submissionTrigger = options.submissionTrigger;
    method = options.method || target.getAttribute("method") || defaultMethod;
    action = options.action || target.getAttribute("action") || defaultAction;
    encType = options.encType || target.getAttribute("enctype") || defaultEncType;
    formData = new FormData(target);

    if (submissionTrigger && submissionTrigger.name) {
      formData.append(submissionTrigger.name, submissionTrigger.value);
    }
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;

    if (form == null) {
      throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
    } // <button>/<input type="submit"> may override attributes of <form>


    method = options.method || target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    action = options.action || target.getAttribute("formaction") || form.getAttribute("action") || defaultAction;
    encType = options.encType || target.getAttribute("formenctype") || form.getAttribute("enctype") || defaultEncType;
    formData = new FormData(form); // Include name + value from a <button>, appending in case the button name
    // matches an existing input name

    if (target.name) {
      formData.append(target.name, target.value);
    }
  } else if (isHtmlElement(target)) {
    throw new Error(`Cannot submit element that is not <form>, <button>, or ` + `<input type="submit|image">`);
  } else {
    method = options.method || defaultMethod;
    action = options.action || defaultAction;
    encType = options.encType || defaultEncType;

    if (target instanceof FormData) {
      formData = target;
    } else {
      formData = new FormData();

      if (target instanceof URLSearchParams) {
        for (let [name, value] of target) {
          formData.append(name, value);
        }
      } else if (target != null) {
        for (let name of Object.keys(target)) {
          formData.append(name, target[name]);
        }
      }
    }
  }

  let {
    protocol,
    host
  } = window.location;
  let url = new URL(action, `${protocol}//${host}`);
  return {
    url,
    method,
    encType,
    formData
  };
}

/**
 * NOTE: If you refactor this to split up the modules into separate files,
 * you'll need to update the rollup config for react-router-dom-v5-compat.
 */

////////////////////////////////////////////////////////////////////////////////
//#region Routers
////////////////////////////////////////////////////////////////////////////////
function createBrowserRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    history: createBrowserHistory({
      window: opts?.window
    }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes: UNSAFE_enhanceManualRouteObjects(routes)
  }).initialize();
}
function createHashRouter(routes, opts) {
  return createRouter({
    basename: opts?.basename,
    history: createHashHistory({
      window: opts?.window
    }),
    hydrationData: opts?.hydrationData || parseHydrationData(),
    routes: UNSAFE_enhanceManualRouteObjects(routes)
  }).initialize();
}

function parseHydrationData() {
  let state = window?.__staticRouterHydrationData;

  if (state && state.errors) {
    state = { ...state,
      errors: deserializeErrors(state.errors)
    };
  }

  return state;
}

function deserializeErrors(errors) {
  if (!errors) return null;
  let entries = Object.entries(errors);
  let serialized = {};

  for (let [key, val] of entries) {
    // Hey you!  If you change this, please change the corresponding logic in
    // serializeErrors in react-router-dom/server.tsx :)
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponse(val.status, val.statusText, val.data, val.internal === true);
    } else {
      serialized[key] = val;
    }
  }

  return serialized;
} //#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Components
////////////////////////////////////////////////////////////////////////////////


/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
function BrowserRouter({
  basename,
  children,
  window
}) {
  let historyRef = React.useRef();

  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window,
      v5Compat: true
    });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return /*#__PURE__*/React.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
function HashRouter({
  basename,
  children,
  window
}) {
  let historyRef = React.useRef();

  if (historyRef.current == null) {
    historyRef.current = createHashHistory({
      window,
      v5Compat: true
    });
  }

  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return /*#__PURE__*/React.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
function HistoryRouter({
  basename,
  children,
  history
}) {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return /*#__PURE__*/React.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history
  });
}

{
  HistoryRouter.displayName = "unstable_HistoryRouter";
}

/**
 * The public API for rendering a history-aware <a>.
 */
const Link = /*#__PURE__*/React.forwardRef(function LinkWithRef({
  onClick,
  relative,
  reloadDocument,
  replace,
  state,
  target,
  to,
  preventScrollReset,
  ...rest
}, ref) {
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative
  });

  function handleClick(event) {
    if (onClick) onClick(event);

    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }

  return (
    /*#__PURE__*/
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    React.createElement("a", Object.assign({}, rest, {
      href: href,
      onClick: reloadDocument ? onClick : handleClick,
      ref: ref,
      target: target
    }))
  );
});

{
  Link.displayName = "Link";
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
const NavLink = /*#__PURE__*/React.forwardRef(function NavLinkWithRef({
  "aria-current": ariaCurrentProp = "page",
  caseSensitive = false,
  className: classNameProp = "",
  end = false,
  style: styleProp,
  to,
  children,
  ...rest
}, ref) {
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = React.useContext(UNSAFE_DataRouterStateContext);
  let {
    navigator
  } = React.useContext(UNSAFE_NavigationContext);
  let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;

  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }

  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className;

  if (typeof classNameProp === "function") {
    className = classNameProp({
      isActive,
      isPending
    });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null].filter(Boolean).join(" ");
  }

  let style = typeof styleProp === "function" ? styleProp({
    isActive,
    isPending
  }) : styleProp;
  return /*#__PURE__*/React.createElement(Link, Object.assign({}, rest, {
    "aria-current": ariaCurrent,
    className: className,
    ref: ref,
    style: style,
    to: to
  }), typeof children === "function" ? children({
    isActive,
    isPending
  }) : children);
});

{
  NavLink.displayName = "NavLink";
}

/**
 * A `@remix-run/router`-aware `<form>`. It behaves like a normal form except
 * that the interaction with the server is with `fetch` instead of new document
 * requests, allowing components to add nicer UX to the page as the form is
 * submitted and returns with data.
 */
const Form = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(FormImpl, Object.assign({}, props, {
    ref: ref
  }));
});

{
  Form.displayName = "Form";
}

const FormImpl = /*#__PURE__*/React.forwardRef(({
  reloadDocument,
  replace,
  method: _method = defaultMethod,
  action,
  onSubmit,
  fetcherKey,
  routeId,
  relative,
  ...props
}, forwardedRef) => {
  let submit = useSubmitImpl(fetcherKey, routeId);
  let formMethod = _method.toLowerCase() === "get" ? "get" : "post";
  let formAction = useFormAction(action, {
    relative
  });

  let submitHandler = event => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    submit(submitter || event.currentTarget, {
      method: _method,
      replace,
      relative
    });
  };

  return /*#__PURE__*/React.createElement("form", Object.assign({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});

{
  FormImpl.displayName = "FormImpl";
}

/**
 * This component will emulate the browser's scroll restoration on location
 * changes.
 */
function ScrollRestoration({
  getKey,
  storageKey
}) {
  useScrollRestoration({
    getKey,
    storageKey
  });
  return null;
}

{
  ScrollRestoration.displayName = "ScrollRestoration";
} //#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Hooks
////////////////////////////////////////////////////////////////////////////////


var DataRouterHook;

(function (DataRouterHook) {
  DataRouterHook["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook["UseSubmitImpl"] = "useSubmitImpl";
  DataRouterHook["UseFetcher"] = "useFetcher";
})(DataRouterHook || (DataRouterHook = {}));

var DataRouterStateHook;

(function (DataRouterStateHook) {
  DataRouterStateHook["UseFetchers"] = "useFetchers";
  DataRouterStateHook["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));

function getDataRouterConsoleError(hookName) {
  return `${hookName} must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.`;
}

function useDataRouterContext(hookName) {
  let ctx = React.useContext(UNSAFE_DataRouterContext);
  !ctx ? invariant(false, getDataRouterConsoleError(hookName))  : void 0;
  return ctx;
}

function useDataRouterState(hookName) {
  let state = React.useContext(UNSAFE_DataRouterStateContext);
  !state ? invariant(false, getDataRouterConsoleError(hookName))  : void 0;
  return state;
}
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */


function useLinkClickHandler(to, {
  target,
  replace: replaceProp,
  state,
  preventScrollReset,
  relative
} = {}) {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return React.useCallback(event => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault(); // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here unless the replace prop is explicitly set

      let replace = replaceProp !== undefined ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative]);
}
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */

function useSearchParams(defaultInit) {
  warning(typeof URLSearchParams !== "undefined", `You cannot use the \`useSearchParams\` hook in a browser that does not ` + `support the URLSearchParams API. If you need to support Internet ` + `Explorer 11, we recommend you load a polyfill such as ` + `https://github.com/ungap/url-search-params\n\n` + `If you're unsure how to load polyfills, we recommend you check out ` + `https://polyfill.io/v3/ which provides some recommendations about how ` + `to load polyfills only for users that need them, instead of for every ` + `user.`) ;
  let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
  let location = useLocation();
  let searchParams = React.useMemo(() => getSearchParamsForLocation(location.search, defaultSearchParamsRef.current), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = React.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}

/**
 * Returns a function that may be used to programmatically submit a form (or
 * some arbitrary data) to the server.
 */
function useSubmit() {
  return useSubmitImpl();
}

function useSubmitImpl(fetcherKey, routeId) {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmitImpl);
  let defaultAction = useFormAction();
  return React.useCallback((target, options = {}) => {
    if (typeof document === "undefined") {
      throw new Error("You are calling submit during the server render. " + "Try calling submit within a `useEffect` or callback instead.");
    }

    let {
      method,
      encType,
      formData,
      url
    } = getFormSubmissionInfo(target, defaultAction, options);
    let href = url.pathname + url.search;
    let opts = {
      replace: options.replace,
      formData,
      formMethod: method,
      formEncType: encType
    };

    if (fetcherKey) {
      !(routeId != null) ? invariant(false, "No routeId available for useFetcher()")  : void 0;
      router.fetch(fetcherKey, routeId, href, opts);
    } else {
      router.navigate(href, opts);
    }
  }, [defaultAction, router, fetcherKey, routeId]);
}

function useFormAction(action, {
  relative
} = {}) {
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let routeContext = React.useContext(UNSAFE_RouteContext);
  !routeContext ? invariant(false, "useFormAction must be used inside a RouteContext")  : void 0;
  let [match] = routeContext.matches.slice(-1);
  let resolvedAction = action ?? "."; // Shallow clone path so we can modify it below, otherwise we modify the
  // object referenced by useMemo inside useResolvedPath

  let path = { ...useResolvedPath(resolvedAction, {
      relative
    })
  }; // Previously we set the default action to ".". The problem with this is that
  // `useResolvedPath(".")` excludes search params and the hash of the resolved
  // URL. This is the intended behavior of when "." is specifically provided as
  // the form action, but inconsistent w/ browsers when the action is omitted.
  // https://github.com/remix-run/remix/issues/927

  let location = useLocation();

  if (action == null) {
    // Safe to write to these directly here since if action was undefined, we
    // would have called useResolvedPath(".") which will never include a search
    // or hash
    path.search = location.search;
    path.hash = location.hash; // When grabbing search params from the URL, remove the automatically
    // inserted ?index param so we match the useResolvedPath search behavior
    // which would not include ?index

    if (match.route.index) {
      let params = new URLSearchParams(path.search);
      params.delete("index");
      path.search = params.toString() ? `?${params.toString()}` : "";
    }
  }

  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  } // If we're operating within a basename, prepend it to the pathname prior
  // to creating the form action.  If this is a root navigation, then just use
  // the raw basename which allows the basename to have full control over the
  // presence of a trailing slash on root actions


  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }

  return createPath(path);
}

function createFetcherForm(fetcherKey, routeId) {
  let FetcherForm = /*#__PURE__*/React.forwardRef((props, ref) => {
    return /*#__PURE__*/React.createElement(FormImpl, Object.assign({}, props, {
      ref: ref,
      fetcherKey: fetcherKey,
      routeId: routeId
    }));
  });

  {
    FetcherForm.displayName = "fetcher.Form";
  }

  return FetcherForm;
}

let fetcherId = 0;

/**
 * Interacts with route loaders and actions without causing a navigation. Great
 * for any interaction that stays on the same page.
 */
function useFetcher() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseFetcher);
  let route = React.useContext(UNSAFE_RouteContext);
  !route ? invariant(false, `useFetcher must be used inside a RouteContext`)  : void 0;
  let routeId = route.matches[route.matches.length - 1]?.route.id;
  !(routeId != null) ? invariant(false, `useFetcher can only be used on routes that contain a unique "id"`)  : void 0;
  let [fetcherKey] = React.useState(() => String(++fetcherId));
  let [Form] = React.useState(() => {
    !routeId ? invariant(false, `No routeId available for fetcher.Form()`)  : void 0;
    return createFetcherForm(fetcherKey, routeId);
  });
  let [load] = React.useState(() => href => {
    !router ? invariant(false, "No router available for fetcher.load()")  : void 0;
    !routeId ? invariant(false, "No routeId available for fetcher.load()")  : void 0;
    router.fetch(fetcherKey, routeId, href);
  });
  let submit = useSubmitImpl(fetcherKey, routeId);
  let fetcher = router.getFetcher(fetcherKey);
  let fetcherWithComponents = React.useMemo(() => ({
    Form,
    submit,
    load,
    ...fetcher
  }), [fetcher, Form, submit, load]);
  React.useEffect(() => {
    // Is this busted when the React team gets real weird and calls effects
    // twice on mount?  We really just need to garbage collect here when this
    // fetcher is no longer around.
    return () => {
      if (!router) {
        console.warn(`No fetcher available to clean up from useFetcher()`);
        return;
      }

      router.deleteFetcher(fetcherKey);
    };
  }, [router, fetcherKey]);
  return fetcherWithComponents;
}
/**
 * Provides all fetchers currently on the page. Useful for layouts and parent
 * routes that need to provide pending/optimistic UI regarding the fetch.
 */

function useFetchers() {
  let state = useDataRouterState(DataRouterStateHook.UseFetchers);
  return [...state.fetchers.values()];
}
const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions = {};
/**
 * When rendered inside a RouterProvider, will restore scroll positions on navigations
 */

function useScrollRestoration({
  getKey,
  storageKey
} = {}) {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseScrollRestoration);
  let {
    restoreScrollPosition,
    preventScrollReset
  } = useDataRouterState(DataRouterStateHook.UseScrollRestoration);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation(); // Trigger manual scroll restoration while we're active

  React.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []); // Save positions on unload

  useBeforeUnload(React.useCallback(() => {
    if (navigation.state === "idle") {
      let key = (getKey ? getKey(location, matches) : null) || location.key;
      savedScrollPositions[key] = window.scrollY;
    }

    sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
    window.history.scrollRestoration = "auto";
  }, [storageKey, getKey, navigation.state, location, matches])); // Read in any saved scroll locations

  React.useLayoutEffect(() => {
    try {
      let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);

      if (sessionPositions) {
        savedScrollPositions = JSON.parse(sessionPositions);
      }
    } catch (e) {// no-op, use default empty object
    }
  }, [storageKey]); // Enable scroll restoration in the router

  React.useLayoutEffect(() => {
    let disableScrollRestoration = router?.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKey);
    return () => disableScrollRestoration && disableScrollRestoration();
  }, [router, getKey]); // Restore scrolling when state.restoreScrollPosition changes

  React.useLayoutEffect(() => {
    // Explicit false means don't do anything (used for submissions)
    if (restoreScrollPosition === false) {
      return;
    } // been here before, scroll to it


    if (typeof restoreScrollPosition === "number") {
      window.scrollTo(0, restoreScrollPosition);
      return;
    } // try to scroll to the hash


    if (location.hash) {
      let el = document.getElementById(location.hash.slice(1));

      if (el) {
        el.scrollIntoView();
        return;
      }
    } // Opt out of scroll reset if this link requested it


    if (preventScrollReset === true) {
      return;
    } // otherwise go to the top on new locations


    window.scrollTo(0, 0);
  }, [location, restoreScrollPosition, preventScrollReset]);
}

function useBeforeUnload(callback) {
  React.useEffect(() => {
    window.addEventListener("beforeunload", callback);
    return () => {
      window.removeEventListener("beforeunload", callback);
    };
  }, [callback]);
} //#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Utils
////////////////////////////////////////////////////////////////////////////////


function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
} //#endregion

export { BrowserRouter, Form, HashRouter, Link, NavLink, ScrollRestoration, createBrowserRouter, createHashRouter, createSearchParams, HistoryRouter as unstable_HistoryRouter, useFetcher, useFetchers, useFormAction, useLinkClickHandler, useSearchParams, useSubmit };
//# sourceMappingURL=react-router-dom.development.js.map
