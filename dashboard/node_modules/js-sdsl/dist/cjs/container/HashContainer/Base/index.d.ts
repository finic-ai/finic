import { Base } from "../../ContainerBase";
declare abstract class HashContainer<K> extends Base {
    protected constructor(initBucketNum?: number, hashFunc?: (x: K) => number);
    clear(): void;
    /**
     * @description Iterate over all elements in the container.
     * @param callback Callback function like Array.forEach.
     */
    abstract forEach(callback: (element: unknown, index: number) => void): void;
    /**
     * @description Remove the elements of the specified value.
     * @param key The element you want to remove.
     */
    abstract eraseElementByKey(key: K): void;
    /**
     * @param key The element you want to find.
     * @return Boolean about if the specified element in the hash set.
     */
    abstract find(key: K): void;
    /**
     * @description Using for `for...of` syntax like Array.
     */
    abstract [Symbol.iterator](): Generator<K | [K, unknown], void, undefined>;
}
export default HashContainer;
