/**
 * NOTE: If you refactor this to split up the modules into separate files,
 * you'll need to update the rollup config for react-router-dom-v5-compat.
 */
import * as React from "react";
import type { NavigateOptions, RelativeRoutingType, RouteObject, To } from "react-router";
import type { Fetcher, FormEncType, FormMethod, GetScrollRestorationKeyFunction, History, HydrationState, Router as RemixRouter } from "@remix-run/router";
import type { SubmitOptions, ParamKeyValuePair, URLSearchParamsInit } from "./dom";
import { createSearchParams } from "./dom";
export type { FormEncType, FormMethod, ParamKeyValuePair, SubmitOptions, URLSearchParamsInit, };
export { createSearchParams };
export type { ActionFunction, ActionFunctionArgs, AwaitProps, DataRouteMatch, DataRouteObject, Fetcher, Hash, IndexRouteObject, IndexRouteProps, JsonFunction, LayoutRouteProps, LoaderFunction, LoaderFunctionArgs, Location, MemoryRouterProps, NavigateFunction, NavigateOptions, NavigateProps, Navigation, Navigator, NonIndexRouteObject, OutletProps, Params, ParamParseKey, Path, PathMatch, Pathname, PathPattern, PathRouteProps, RedirectFunction, RelativeRoutingType, RouteMatch, RouteObject, RouteProps, RouterProps, RouterProviderProps, RoutesProps, Search, ShouldRevalidateFunction, To, } from "react-router";
export { AbortedDeferredError, Await, MemoryRouter, Navigate, NavigationType, Outlet, Route, Router, RouterProvider, Routes, createMemoryRouter, createPath, createRoutesFromChildren, createRoutesFromElements, defer, isRouteErrorResponse, generatePath, json, matchPath, matchRoutes, parsePath, redirect, renderMatches, resolvePath, useActionData, useAsyncError, useAsyncValue, useHref, useInRouterContext, useLoaderData, useLocation, useMatch, useMatches, useNavigate, useNavigation, useNavigationType, useOutlet, useOutletContext, useParams, useResolvedPath, useRevalidator, useRouteError, useRouteLoaderData, useRoutes, } from "react-router";
/** @internal */
export { UNSAFE_DataRouterContext, UNSAFE_DataRouterStateContext, UNSAFE_DataStaticRouterContext, UNSAFE_NavigationContext, UNSAFE_LocationContext, UNSAFE_RouteContext, UNSAFE_enhanceManualRouteObjects, } from "react-router";
declare global {
    var __staticRouterHydrationData: HydrationState | undefined;
}
export declare function createBrowserRouter(routes: RouteObject[], opts?: {
    basename?: string;
    hydrationData?: HydrationState;
    window?: Window;
}): RemixRouter;
export declare function createHashRouter(routes: RouteObject[], opts?: {
    basename?: string;
    hydrationData?: HydrationState;
    window?: Window;
}): RemixRouter;
export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
}
/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 */
export declare function BrowserRouter({ basename, children, window, }: BrowserRouterProps): JSX.Element;
export interface HashRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
}
/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
export declare function HashRouter({ basename, children, window }: HashRouterProps): JSX.Element;
export interface HistoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    history: History;
}
/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 */
declare function HistoryRouter({ basename, children, history }: HistoryRouterProps): JSX.Element;
declare namespace HistoryRouter {
    var displayName: string;
}
export { HistoryRouter as unstable_HistoryRouter };
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    reloadDocument?: boolean;
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: RelativeRoutingType;
    to: To;
}
/**
 * The public API for rendering a history-aware <a>.
 */
export declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
export interface NavLinkProps extends Omit<LinkProps, "className" | "style" | "children"> {
    children?: React.ReactNode | ((props: {
        isActive: boolean;
        isPending: boolean;
    }) => React.ReactNode);
    caseSensitive?: boolean;
    className?: string | ((props: {
        isActive: boolean;
        isPending: boolean;
    }) => string | undefined);
    end?: boolean;
    style?: React.CSSProperties | ((props: {
        isActive: boolean;
        isPending: boolean;
    }) => React.CSSProperties | undefined);
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export declare const NavLink: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>>;
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * The HTTP verb to use when the form is submit. Supports "get", "post",
     * "put", "delete", "patch".
     */
    method?: FormMethod;
    /**
     * Normal `<form action>` but supports React Router's relative paths.
     */
    action?: string;
    /**
     * Forces a full document navigation instead of a fetch.
     */
    reloadDocument?: boolean;
    /**
     * Replaces the current entry in the browser history stack when the form
     * navigates. Use this if you don't want the user to be able to click "back"
     * to the page with the form on it.
     */
    replace?: boolean;
    /**
     * Determines whether the form action is relative to the route hierarchy or
     * the pathname.  Use this if you want to opt out of navigating the route
     * hierarchy and want to instead route based on /-delimited URL segments
     */
    relative?: RelativeRoutingType;
    /**
     * A function to call when the form is submitted. If you call
     * `event.preventDefault()` then this form will not do anything.
     */
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
}
/**
 * A `@remix-run/router`-aware `<form>`. It behaves like a normal form except
 * that the interaction with the server is with `fetch` instead of new document
 * requests, allowing components to add nicer UX to the page as the form is
 * submitted and returns with data.
 */
export declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
interface ScrollRestorationProps {
    getKey?: GetScrollRestorationKeyFunction;
    storageKey?: string;
}
/**
 * This component will emulate the browser's scroll restoration on location
 * changes.
 */
export declare function ScrollRestoration({ getKey, storageKey, }: ScrollRestorationProps): null;
export declare namespace ScrollRestoration {
    var displayName: string;
}
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
export declare function useLinkClickHandler<E extends Element = HTMLAnchorElement>(to: To, { target, replace: replaceProp, state, preventScrollReset, relative, }?: {
    target?: React.HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: RelativeRoutingType;
}): (event: React.MouseEvent<E, MouseEvent>) => void;
/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export declare function useSearchParams(defaultInit?: URLSearchParamsInit): [URLSearchParams, SetURLSearchParams];
declare type SetURLSearchParams = (nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit), navigateOpts?: NavigateOptions) => void;
declare type SubmitTarget = HTMLFormElement | HTMLButtonElement | HTMLInputElement | FormData | URLSearchParams | {
    [name: string]: string;
} | null;
/**
 * Submits a HTML `<form>` to the server without reloading the page.
 */
export interface SubmitFunction {
    (
    /**
     * Specifies the `<form>` to be submitted to the server, a specific
     * `<button>` or `<input type="submit">` to use to submit the form, or some
     * arbitrary data to submit.
     *
     * Note: When using a `<button>` its `name` and `value` will also be
     * included in the form data that is submitted.
     */
    target: SubmitTarget, 
    /**
     * Options that override the `<form>`'s own attributes. Required when
     * submitting arbitrary data without a backing `<form>`.
     */
    options?: SubmitOptions): void;
}
/**
 * Returns a function that may be used to programmatically submit a form (or
 * some arbitrary data) to the server.
 */
export declare function useSubmit(): SubmitFunction;
export declare function useFormAction(action?: string, { relative }?: {
    relative?: RelativeRoutingType;
}): string;
declare function createFetcherForm(fetcherKey: string, routeId: string): React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
export declare type FetcherWithComponents<TData> = Fetcher<TData> & {
    Form: ReturnType<typeof createFetcherForm>;
    submit: (target: SubmitTarget, options?: Omit<SubmitOptions, "replace">) => void;
    load: (href: string) => void;
};
/**
 * Interacts with route loaders and actions without causing a navigation. Great
 * for any interaction that stays on the same page.
 */
export declare function useFetcher<TData = any>(): FetcherWithComponents<TData>;
/**
 * Provides all fetchers currently on the page. Useful for layouts and parent
 * routes that need to provide pending/optimistic UI regarding the fetch.
 */
export declare function useFetchers(): Fetcher[];
