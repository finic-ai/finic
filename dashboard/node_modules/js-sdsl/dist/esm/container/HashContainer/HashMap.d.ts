import { initContainer } from "../ContainerBase";
import HashContainer from './Base';
declare class HashMap<K, V> extends HashContainer<K> {
    constructor(container?: initContainer<[K, V]>, initBucketNum?: number, hashFunc?: (x: K) => number);
    forEach(callback: (element: [K, V], index: number) => void): void;
    /**
     * @description Insert a new key-value pair to hash map or set value by key.
     * @param key The key you want to insert.
     * @param value The value you want to insert.
     * @example HashMap.setElement(1, 2); // insert a key-value pair [1, 2]
     */
    setElement(key: K, value: V): void;
    /**
     * @description Get the value of the element which has the specified key.
     * @param key The key you want to get.
     */
    getElementByKey(key: K): V | undefined;
    eraseElementByKey(key: K): void;
    find(key: K): boolean;
    [Symbol.iterator](): Generator<[K, V], void, unknown>;
}
export default HashMap;
