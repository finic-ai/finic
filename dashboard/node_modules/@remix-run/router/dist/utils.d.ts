import type { Location, Path, To } from "./history";
/**
 * Map of routeId -> data returned from a loader/action/error
 */
export interface RouteData {
    [routeId: string]: any;
}
export declare enum ResultType {
    data = "data",
    deferred = "deferred",
    redirect = "redirect",
    error = "error"
}
/**
 * Successful result from a loader or action
 */
export interface SuccessResult {
    type: ResultType.data;
    data: any;
    statusCode?: number;
    headers?: Headers;
}
/**
 * Successful defer() result from a loader or action
 */
export interface DeferredResult {
    type: ResultType.deferred;
    deferredData: DeferredData;
}
/**
 * Redirect result from a loader or action
 */
export interface RedirectResult {
    type: ResultType.redirect;
    status: number;
    location: string;
    revalidate: boolean;
}
/**
 * Unsuccessful result from a loader or action
 */
export interface ErrorResult {
    type: ResultType.error;
    error: any;
    headers?: Headers;
}
/**
 * Result from a loader or action - potentially successful or unsuccessful
 */
export declare type DataResult = SuccessResult | DeferredResult | RedirectResult | ErrorResult;
export declare type SubmissionFormMethod = "post" | "put" | "patch" | "delete";
export declare type FormMethod = "get" | SubmissionFormMethod;
export declare type FormEncType = "application/x-www-form-urlencoded" | "multipart/form-data";
/**
 * @private
 * Internal interface to pass around for action submissions, not intended for
 * external consumption
 */
export interface Submission {
    formMethod: SubmissionFormMethod;
    formAction: string;
    formEncType: FormEncType;
    formData: FormData;
}
/**
 * @private
 * Arguments passed to route loader/action functions.  Same for now but we keep
 * this as a private implementation detail in case they diverge in the future.
 */
interface DataFunctionArgs {
    request: Request;
    params: Params;
    context?: any;
}
/**
 * Arguments passed to loader functions
 */
export interface LoaderFunctionArgs extends DataFunctionArgs {
}
/**
 * Arguments passed to action functions
 */
export interface ActionFunctionArgs extends DataFunctionArgs {
}
/**
 * Route loader function signature
 */
export interface LoaderFunction {
    (args: LoaderFunctionArgs): Promise<Response> | Response | Promise<any> | any;
}
/**
 * Route action function signature
 */
export interface ActionFunction {
    (args: ActionFunctionArgs): Promise<Response> | Response | Promise<any> | any;
}
/**
 * Route shouldRevalidate function signature.  This runs after any submission
 * (navigation or fetcher), so we flatten the navigation/fetcher submission
 * onto the arguments.  It shouldn't matter whether it came from a navigation
 * or a fetcher, what really matters is the URLs and the formData since loaders
 * have to re-run based on the data models that were potentially mutated.
 */
export interface ShouldRevalidateFunction {
    (args: {
        currentUrl: URL;
        currentParams: AgnosticDataRouteMatch["params"];
        nextUrl: URL;
        nextParams: AgnosticDataRouteMatch["params"];
        formMethod?: Submission["formMethod"];
        formAction?: Submission["formAction"];
        formEncType?: Submission["formEncType"];
        formData?: Submission["formData"];
        actionResult?: DataResult;
        defaultShouldRevalidate: boolean;
    }): boolean;
}
/**
 * Base RouteObject with common props shared by all types of routes
 */
declare type AgnosticBaseRouteObject = {
    caseSensitive?: boolean;
    path?: string;
    id?: string;
    loader?: LoaderFunction;
    action?: ActionFunction;
    hasErrorBoundary?: boolean;
    shouldRevalidate?: ShouldRevalidateFunction;
    handle?: any;
};
/**
 * Index routes must not have children
 */
export declare type AgnosticIndexRouteObject = AgnosticBaseRouteObject & {
    children?: undefined;
    index: true;
};
/**
 * Non-index routes may have children, but cannot have index
 */
export declare type AgnosticNonIndexRouteObject = AgnosticBaseRouteObject & {
    children?: AgnosticRouteObject[];
    index?: false;
};
/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export declare type AgnosticRouteObject = AgnosticIndexRouteObject | AgnosticNonIndexRouteObject;
export declare type AgnosticDataIndexRouteObject = AgnosticIndexRouteObject & {
    id: string;
};
export declare type AgnosticDataNonIndexRouteObject = AgnosticNonIndexRouteObject & {
    children?: AgnosticDataRouteObject[];
    id: string;
};
/**
 * A data route object, which is just a RouteObject with a required unique ID
 */
export declare type AgnosticDataRouteObject = AgnosticDataIndexRouteObject | AgnosticDataNonIndexRouteObject;
declare type _PathParam<Path extends string> = Path extends `${infer L}/${infer R}` ? _PathParam<L> | _PathParam<R> : Path extends `${string}:${infer Param}` ? Param : never;
/**
 * Examples:
 * "/a/b/*" -> "*"
 * ":a" -> "a"
 * "/a/:b" -> "b"
 * "/a/blahblahblah:b" -> "b"
 * "/:a/:b" -> "a" | "b"
 * "/:a/b/:c/*" -> "a" | "c" | "*"
 */
declare type PathParam<Path extends string> = Path extends "*" ? "*" : Path extends `${infer Rest}/*` ? "*" | _PathParam<Rest> : _PathParam<Path>;
export declare type ParamParseKey<Segment extends string> = [
    PathParam<Segment>
] extends [never] ? string : PathParam<Segment>;
/**
 * The parameters that were parsed from the URL path.
 */
export declare type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};
/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface AgnosticRouteMatch<ParamKey extends string = string, RouteObjectType extends AgnosticRouteObject = AgnosticRouteObject> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The route object that was used to match.
     */
    route: RouteObjectType;
}
export interface AgnosticDataRouteMatch extends AgnosticRouteMatch<string, AgnosticDataRouteObject> {
}
export declare function convertRoutesToDataRoutes(routes: AgnosticRouteObject[], parentPath?: number[], allIds?: Set<string>): AgnosticDataRouteObject[];
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/utils/match-routes
 */
export declare function matchRoutes<RouteObjectType extends AgnosticRouteObject = AgnosticRouteObject>(routes: RouteObjectType[], locationArg: Partial<Location> | string, basename?: string): AgnosticRouteMatch<string, RouteObjectType>[] | null;
/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/utils/generate-path
 */
export declare function generatePath<Path extends string>(path: Path, params?: {
    [key in PathParam<Path>]: string;
}): string;
/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern<Path extends string = string> {
    /**
     * A string to match against a URL pathname. May contain `:id`-style segments
     * to indicate placeholders for dynamic parameters. May also end with `/*` to
     * indicate matching the rest of the URL pathname.
     */
    path: Path;
    /**
     * Should be `true` if the static portions of the `path` should be matched in
     * the same case.
     */
    caseSensitive?: boolean;
    /**
     * Should be `true` if this pattern should match the entire URL pathname.
     */
    end?: boolean;
}
/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The pattern that was used to match.
     */
    pattern: PathPattern;
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/utils/match-path
 */
export declare function matchPath<ParamKey extends ParamParseKey<Path>, Path extends string>(pattern: PathPattern<Path> | Path, pathname: string): PathMatch<ParamKey> | null;
/**
 * @private
 */
export declare function stripBasename(pathname: string, basename: string): string | null;
/**
 * @private
 */
export declare function warning(cond: any, message: string): void;
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/utils/resolve-path
 */
export declare function resolvePath(to: To, fromPathname?: string): Path;
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
export declare function getPathContributingMatches<T extends AgnosticRouteMatch = AgnosticRouteMatch>(matches: T[]): T[];
/**
 * @private
 */
export declare function resolveTo(toArg: To, routePathnames: string[], locationPathname: string, isPathRelative?: boolean): Path;
/**
 * @private
 */
export declare function getToPathname(to: To): string | undefined;
/**
 * @private
 */
export declare const joinPaths: (paths: string[]) => string;
/**
 * @private
 */
export declare const normalizePathname: (pathname: string) => string;
/**
 * @private
 */
export declare const normalizeSearch: (search: string) => string;
/**
 * @private
 */
export declare const normalizeHash: (hash: string) => string;
export declare type JsonFunction = <Data>(data: Data, init?: number | ResponseInit) => Response;
/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
export declare const json: JsonFunction;
export interface TrackedPromise extends Promise<any> {
    _tracked?: boolean;
    _data?: any;
    _error?: any;
}
export declare class AbortedDeferredError extends Error {
}
export declare class DeferredData {
    private pendingKeys;
    private controller;
    private abortPromise;
    private unlistenAbortSignal;
    private subscriber?;
    data: Record<string, unknown>;
    constructor(data: Record<string, unknown>);
    private trackPromise;
    private onSettle;
    subscribe(fn: (aborted: boolean) => void): void;
    cancel(): void;
    resolveData(signal: AbortSignal): Promise<boolean>;
    get done(): boolean;
    get unwrappedData(): {};
}
export declare function defer(data: Record<string, unknown>): DeferredData;
export declare type RedirectFunction = (url: string, init?: number | ResponseInit) => Response;
/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
export declare const redirect: RedirectFunction;
/**
 * @private
 * Utility class we use to hold auto-unwrapped 4xx/5xx Response bodies
 */
export declare class ErrorResponse {
    status: number;
    statusText: string;
    data: any;
    error?: Error;
    internal: boolean;
    constructor(status: number, statusText: string | undefined, data: any, internal?: boolean);
}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response throw from an action/loader
 */
export declare function isRouteErrorResponse(e: any): e is ErrorResponse;
export {};
