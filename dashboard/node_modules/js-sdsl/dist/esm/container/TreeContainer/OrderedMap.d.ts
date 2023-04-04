import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { initContainer } from "../ContainerBase";
export declare class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
    get pointer(): [K, V];
    copy(): OrderedMapIterator<K, V>;
}
declare class OrderedMap<K, V> extends TreeContainer<K, V> {
    /**
     * @param container The initialization container.
     * @param cmp The compare function.
     * @param enableIndex Whether to enable iterator indexing function.
     */
    constructor(container?: initContainer<[K, V]>, cmp?: (x: K, y: K) => number, enableIndex?: boolean);
    begin(): OrderedMapIterator<K, V>;
    end(): OrderedMapIterator<K, V>;
    rBegin(): OrderedMapIterator<K, V>;
    rEnd(): OrderedMapIterator<K, V>;
    front(): [K, V] | undefined;
    back(): [K, V] | undefined;
    forEach(callback: (element: [K, V], index: number) => void): void;
    lowerBound(_key: K): OrderedMapIterator<K, V>;
    upperBound(_key: K): OrderedMapIterator<K, V>;
    reverseLowerBound(_key: K): OrderedMapIterator<K, V>;
    reverseUpperBound(_key: K): OrderedMapIterator<K, V>;
    /**
     * @description Insert a _key-_value pair or set _value by the given _key.
     * @param _key The _key want to insert.
     * @param _value The _value want to set.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    setElement(_key: K, _value: V, hint?: OrderedMapIterator<K, V>): void;
    find(_key: K): OrderedMapIterator<K, V>;
    /**
     * @description Get the _value of the element of the specified _key.
     */
    getElementByKey(_key: K): V | undefined;
    getElementByPos(pos: number): [K, V];
    union(other: OrderedMap<K, V>): void;
    [Symbol.iterator](): Generator<[K, V], void, undefined>;
}
export default OrderedMap;
