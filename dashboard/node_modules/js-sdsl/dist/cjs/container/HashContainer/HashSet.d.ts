import HashContainer from './Base';
import { initContainer } from "../ContainerBase";
declare class HashSet<K> extends HashContainer<K> {
    constructor(container?: initContainer<K>, initBucketNum?: number, _hashFunc?: (x: K) => number);
    forEach(callback: (element: K, index: number) => void): void;
    /**
     * @description Insert element to hash set.
     * @param element The element you want to insert.
     */
    insert(element: K): void;
    eraseElementByKey(key: K): void;
    find(element: K): boolean;
    [Symbol.iterator](): Generator<K, void, unknown>;
}
export default HashSet;
