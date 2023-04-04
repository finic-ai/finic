import type { ActionFunction, ActionFunctionArgs, Fetcher, HydrationState, JsonFunction, LoaderFunction, LoaderFunctionArgs, Location, Navigation, Params, ParamParseKey, Path, PathMatch, PathPattern, RedirectFunction, Router as RemixRouter, ShouldRevalidateFunction, To, InitialEntry } from "@remix-run/router";
import { AbortedDeferredError, Action as NavigationType, createPath, defer, generatePath, isRouteErrorResponse, json, matchPath, matchRoutes, parsePath, redirect, resolvePath } from "@remix-run/router";
import type { AwaitProps, MemoryRouterProps, NavigateProps, OutletProps, RouteProps, PathRouteProps, LayoutRouteProps, IndexRouteProps, RouterProps, RoutesProps, RouterProviderProps } from "./lib/components";
import { enhanceManualRouteObjects, createRoutesFromChildren, renderMatches, Await, MemoryRouter, Navigate, Outlet, Route, Router, RouterProvider, Routes } from "./lib/components";
import type { DataRouteMatch, DataRouteObject, IndexRouteObject, Navigator, NavigateOptions, NonIndexRouteObject, RouteMatch, RouteObject, RelativeRoutingType } from "./lib/context";
import { DataRouterContext, DataRouterStateContext, DataStaticRouterContext, LocationContext, NavigationContext, RouteContext } from "./lib/context";
import type { NavigateFunction } from "./lib/hooks";
import { useHref, useInRouterContext, useLocation, useMatch, useNavigationType, useNavigate, useOutlet, useOutletContext, useParams, useResolvedPath, useRoutes, useActionData, useAsyncError, useAsyncValue, useLoaderData, useMatches, useNavigation, useRevalidator, useRouteError, useRouteLoaderData } from "./lib/hooks";
declare type Hash = string;
declare type Pathname = string;
declare type Search = string;
export type { ActionFunction, ActionFunctionArgs, AwaitProps, DataRouteMatch, DataRouteObject, Fetcher, Hash, IndexRouteObject, IndexRouteProps, JsonFunction, LayoutRouteProps, LoaderFunction, LoaderFunctionArgs, Location, MemoryRouterProps, NavigateFunction, NavigateOptions, NavigateProps, Navigation, Navigator, NonIndexRouteObject, OutletProps, Params, ParamParseKey, Path, PathMatch, Pathname, PathPattern, PathRouteProps, RedirectFunction, RelativeRoutingType, RouteMatch, RouteObject, RouteProps, RouterProps, RouterProviderProps, RoutesProps, Search, ShouldRevalidateFunction, To, };
export { AbortedDeferredError, Await, MemoryRouter, Navigate, NavigationType, Outlet, Route, Router, RouterProvider, Routes, createPath, createRoutesFromChildren, createRoutesFromChildren as createRoutesFromElements, defer, isRouteErrorResponse, generatePath, json, matchPath, matchRoutes, parsePath, redirect, renderMatches, resolvePath, useActionData, useAsyncError, useAsyncValue, useHref, useInRouterContext, useLoaderData, useLocation, useMatch, useMatches, useNavigate, useNavigation, useNavigationType, useOutlet, useOutletContext, useParams, useResolvedPath, useRevalidator, useRouteError, useRouteLoaderData, useRoutes, };
export declare function createMemoryRouter(routes: RouteObject[], opts?: {
    basename?: string;
    hydrationData?: HydrationState;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
}): RemixRouter;
/** @internal */
export { NavigationContext as UNSAFE_NavigationContext, LocationContext as UNSAFE_LocationContext, RouteContext as UNSAFE_RouteContext, DataRouterContext as UNSAFE_DataRouterContext, DataRouterStateContext as UNSAFE_DataRouterStateContext, DataStaticRouterContext as UNSAFE_DataStaticRouterContext, enhanceManualRouteObjects as UNSAFE_enhanceManualRouteObjects, };
