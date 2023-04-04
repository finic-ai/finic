import type { FormEncType, FormMethod } from "@remix-run/router";
import type { RelativeRoutingType } from "react-router";
export declare const defaultMethod = "get";
export declare function isHtmlElement(object: any): object is HTMLElement;
export declare function isButtonElement(object: any): object is HTMLButtonElement;
export declare function isFormElement(object: any): object is HTMLFormElement;
export declare function isInputElement(object: any): object is HTMLInputElement;
declare type LimitedMouseEvent = Pick<MouseEvent, "button" | "metaKey" | "altKey" | "ctrlKey" | "shiftKey">;
export declare function shouldProcessLinkClick(event: LimitedMouseEvent, target?: string): boolean;
export declare type ParamKeyValuePair = [string, string];
export declare type URLSearchParamsInit = string | ParamKeyValuePair[] | Record<string, string | string[]> | URLSearchParams;
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
export declare function createSearchParams(init?: URLSearchParamsInit): URLSearchParams;
export declare function getSearchParamsForLocation(locationSearch: string, defaultSearchParams: URLSearchParams): URLSearchParams;
export interface SubmitOptions {
    /**
     * The HTTP method used to submit the form. Overrides `<form method>`.
     * Defaults to "GET".
     */
    method?: FormMethod;
    /**
     * The action URL path used to submit the form. Overrides `<form action>`.
     * Defaults to the path of the current route.
     *
     * Note: It is assumed the path is already resolved. If you need to resolve a
     * relative path, use `useFormAction`.
     */
    action?: string;
    /**
     * The action URL used to submit the form. Overrides `<form encType>`.
     * Defaults to "application/x-www-form-urlencoded".
     */
    encType?: FormEncType;
    /**
     * Set `true` to replace the current entry in the browser's history stack
     * instead of creating a new one (i.e. stay on "the same page"). Defaults
     * to `false`.
     */
    replace?: boolean;
    /**
     * Determines whether the form action is relative to the route hierarchy or
     * the pathname.  Use this if you want to opt out of navigating the route
     * hierarchy and want to instead route based on /-delimited URL segments
     */
    relative?: RelativeRoutingType;
}
export declare function getFormSubmissionInfo(target: HTMLFormElement | HTMLButtonElement | HTMLInputElement | FormData | URLSearchParams | {
    [name: string]: string;
} | null, defaultAction: string, options: SubmitOptions): {
    url: URL;
    method: string;
    encType: string;
    formData: FormData;
};
export {};
