import TreeContainer from './Base';
import TreeIterator from './Base/TreeIterator';
import { initContainer } from "../ContainerBase";
export declare class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
    get pointer(): K;
    copy(): OrderedSetIterator<K>;
}
declare class OrderedSet<K> extends TreeContainer<K, undefined> {
    /**
     * @param container The initialization container.
     * @param cmp The compare function.
     * @param enableIndex Whether to enable iterator indexing function.
     */
    constructor(container?: initContainer<K>, cmp?: (x: K, y: K) => number, enableIndex?: boolean);
    begin(): OrderedSetIterator<K>;
    end(): OrderedSetIterator<K>;
    rBegin(): OrderedSetIterator<K>;
    rEnd(): OrderedSetIterator<K>;
    front(): K | undefined;
    back(): K | undefined;
    forEach(callback: (element: K, index: number) => void): void;
    getElementByPos(pos: number): K;
    /**
     * @description Insert element to set.
     * @param _key The _key want to insert.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    insert(_key: K, hint?: OrderedSetIterator<K>): void;
    find(element: K): OrderedSetIterator<K>;
    lowerBound(_key: K): OrderedSetIterator<K>;
    upperBound(_key: K): OrderedSetIterator<K>;
    reverseLowerBound(_key: K): OrderedSetIterator<K>;
    reverseUpperBound(_key: K): OrderedSetIterator<K>;
    union(other: OrderedSet<K>): void;
    [Symbol.iterator](): Generator<K, void, undefined>;
}
export default OrderedSet;
