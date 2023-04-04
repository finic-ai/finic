import * as React from "react";
import type { Router as RemixRouter, StaticHandlerContext } from "@remix-run/router";
import type { Location, RouteObject } from "react-router-dom";
export interface StaticRouterProps {
    basename?: string;
    children?: React.ReactNode;
    location: Partial<Location> | string;
}
/**
 * A <Router> that may not navigate to any other location. This is useful
 * on the server where there is no stateful UI.
 */
export declare function StaticRouter({ basename, children, location: locationProp, }: StaticRouterProps): JSX.Element;
export interface StaticRouterProviderProps {
    context: StaticHandlerContext;
    router: RemixRouter;
    hydrate?: boolean;
    nonce?: string;
}
/**
 * A Data Router that may not navigate to any other location. This is useful
 * on the server where there is no stateful UI.
 */
export declare function unstable_StaticRouterProvider({ context, router, hydrate, nonce, }: StaticRouterProviderProps): JSX.Element;
export declare function unstable_createStaticRouter(routes: RouteObject[], context: StaticHandlerContext): RemixRouter;
