import { convertRoutesToDataRoutes, getPathContributingMatches } from "./utils";
export type { ActionFunction, ActionFunctionArgs, AgnosticDataIndexRouteObject, AgnosticDataNonIndexRouteObject, AgnosticDataRouteMatch, AgnosticDataRouteObject, AgnosticIndexRouteObject, AgnosticNonIndexRouteObject, AgnosticRouteMatch, AgnosticRouteObject, TrackedPromise, FormEncType, FormMethod, JsonFunction, LoaderFunction, LoaderFunctionArgs, ParamParseKey, Params, PathMatch, PathPattern, RedirectFunction, ShouldRevalidateFunction, Submission, } from "./utils";
export { AbortedDeferredError, ErrorResponse, defer, generatePath, getToPathname, isRouteErrorResponse, joinPaths, json, matchPath, matchRoutes, normalizePathname, redirect, resolvePath, resolveTo, stripBasename, warning, } from "./utils";
export type { BrowserHistory, BrowserHistoryOptions, HashHistory, HashHistoryOptions, History, InitialEntry, Location, MemoryHistory, MemoryHistoryOptions, Path, To, } from "./history";
export { Action, createBrowserHistory, createPath, createHashHistory, createMemoryHistory, invariant, parsePath, } from "./history";
export * from "./router";
/** @internal */
export { convertRoutesToDataRoutes as UNSAFE_convertRoutesToDataRoutes, getPathContributingMatches as UNSAFE_getPathContributingMatches, };
