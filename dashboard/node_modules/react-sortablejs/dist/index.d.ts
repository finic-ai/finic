import { CSSProperties, ForwardRefExoticComponent, ReactHTML, ReactNode, RefAttributes, Component } from "react";
import Sortable, { MoveEvent, Options, SortableEvent } from "sortablejs";
/**
 * Construct a type with the properties of T except for those in type K.
 * Including this allows for backwards compatibility with earlier versions of TS.
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface ItemInterface {
    /** The unique id associated with your item. It's recommended this is the same as the key prop for your list item. */
    id: string | number;
    /** When true, the item is selected using MultiDrag */
    selected?: boolean;
    /** When true, the item is deemed "chosen", which basically just a mousedown event. */
    chosen?: boolean;
    /** When true, it will not be possible to pick this item up in the list. */
    filtered?: boolean;
    [property: string]: any;
}
export interface ReactSortableProps<T> extends ReactSortableOptions, Omit<Options, AllMethodNames> {
    /**
     * The list of items to use.
     */
    list: T[];
    /**
     * Sets the state for your list of items.
     */
    setList: (newState: T[], sortable: Sortable | null, store: Store) => void;
    /**
     * If parsing in a component WITHOUT a ref, an error will be thrown.
     *
     * To fix this, use the `forwardRef` component.
     *
     * @example
     * forwardRef<HTMLElement, YOURPROPS>((props, ref) => <button {...props} ref={ref} />)
     */
    tag?: ForwardRefExoticComponent<RefAttributes<any>> | keyof ReactHTML;
    /**
     * If this is provided, the function will replace the clone in place.
     *
     * When an is moved from `A` to `B` with `pull: 'clone'`,
     * the original element will be moved to `B`
     * and the new clone will be placed in `A`
     */
    clone?: (currentItem: T, evt: SortableEvent) => T;
    style?: CSSProperties;
    className?: string;
    id?: string;
    children?: ReactNode;
}
/**
 * Holds the react component as a reference so we can access it's store.
 *
 * Mainly used to access `props.list` within another components.
 */
export interface Store {
    dragging: null | ReactSortable<any>;
}
/**
 * Change the `on[...]` methods in Sortable.Options,
 * so that they all have an extra arg that is `store: Store`
 */
export type ReactSortableOptions = Partial<Record<AllMethodsExceptMove, (evt: SortableEvent, sortable: Sortable | null, store: Store) => void>> & {
    /**
     * The default sortable behaviour has been changed.
     *
     * If the return value is void, then the defaults will kick in.
     * it saves the user trying to figure it out.
     * and they can just use onmove as a callback value
     */
    onMove?: (evt: MoveEvent, originalEvent: Event, sortable: Sortable | null, store: Store) => boolean | -1 | 1 | void;
};
/** All method names starting with `on` in `Sortable.Options` */
export type AllMethodNames = "onAdd" | "onChange" | "onChoose" | "onClone" | "onEnd" | "onFilter" | "onMove" | "onRemove" | "onSort" | "onSpill" | "onStart" | "onUnchoose" | "onUpdate" | "onSelect" | "onDeselect";
/** Method names that fire in `this`, when this is react-sortable */
export type HandledMethodNames = "onAdd" | "onRemove" | "onUpdate" | "onStart" | "onEnd" | "onSpill" | "onSelect" | "onDeselect" | "onChoose" | "onUnchoose";
export type UnHandledMethodNames = Exclude<AllMethodsExceptMove, HandledMethodNames | "onMove">;
/**
 * Same as `SortableMethodKeys` type but with out the string `onMove`.
 */
export type AllMethodsExceptMove = Exclude<AllMethodNames, "onMove">;
export class ReactSortable<T extends ItemInterface> extends Component<ReactSortableProps<T>> {
    static defaultProps: Partial<ReactSortableProps<any>>;
    constructor(props: ReactSortableProps<T>);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ReactSortableProps<T>): void;
    render(): JSX.Element;
    /** Appends the `sortable` property to this component */
    private get sortable();
    /** Converts all the props from `ReactSortable` into the `options` object that `Sortable.create(el, [options])` can use. */
    makeOptions(): Options;
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop & an `on[Handler]` ReactSortable method.  */
    prepareOnHandlerPropAndDOM(evtName: HandledMethodNames): (evt: SortableEvent) => void;
    /** Prepares a method that will be used in the sortable options to call an `on[Handler]` prop */
    prepareOnHandlerProp(evtName: Exclude<AllMethodsExceptMove, HandledMethodNames>): (evt: SortableEvent) => void;
    /** Calls the `props.on[Handler]` function */
    callOnHandlerProp(evt: SortableEvent, evtName: AllMethodsExceptMove): void;
    onAdd(evt: MultiDragEvent): void;
    onRemove(evt: MultiDragEvent): void;
    onUpdate(evt: MultiDragEvent): void;
    onStart(): void;
    onEnd(): void;
    onChoose(evt: SortableEvent): void;
    onUnchoose(evt: SortableEvent): void;
    onSpill(evt: SortableEvent): void;
    onSelect(evt: MultiDragEvent): void;
    onDeselect(evt: MultiDragEvent): void;
}
interface MultiIndices {
    multiDragElement: HTMLElement;
    index: number;
}
interface MultiDragEvent extends SortableEvent {
    clones: HTMLElement[];
    oldIndicies: MultiIndices[];
    newIndicies: MultiIndices[];
    swapItem: HTMLElement | null;
}
export { default as Sortable, Direction, DOMRect, GroupOptions, MoveEvent, Options, PullResult, PutResult, SortableEvent, SortableOptions, Utils, } from "sortablejs";

//# sourceMappingURL=index.d.ts.map
