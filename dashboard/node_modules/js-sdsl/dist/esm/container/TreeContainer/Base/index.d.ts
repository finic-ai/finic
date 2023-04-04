import type TreeIterator from './TreeIterator';
import { Container } from "../../ContainerBase";
declare abstract class TreeContainer<K, V> extends Container<K | [K, V]> {
    /**
     * @param cmp The compare function.
     * @param enableIndex Whether to enable iterator indexing function.
     */
    protected constructor(cmp?: (x: K, y: K) => number, enableIndex?: boolean);
    /**
     * @param _key The given _key you want to compare.
     * @return An iterator to the first element not less than the given _key.
     */
    abstract lowerBound(_key: K): TreeIterator<K, V>;
    /**
     * @param _key The given _key you want to compare.
     * @return An iterator to the first element greater than the given _key.
     */
    abstract upperBound(_key: K): TreeIterator<K, V>;
    /**
     * @param _key The given _key you want to compare.
     * @return An iterator to the first element not greater than the given _key.
     */
    abstract reverseLowerBound(_key: K): TreeIterator<K, V>;
    /**
     * @param _key The given _key you want to compare.
     * @return An iterator to the first element less than the given _key.
     */
    abstract reverseUpperBound(_key: K): TreeIterator<K, V>;
    /**
     * @description Union the other tree to self.
     * @param other The other tree container you want to merge.
     */
    abstract union(other: TreeContainer<K, V>): void;
    clear(): void;
    /**
     * @description Update node's _key by iterator.
     * @param iter The iterator you want to change.
     * @param _key The _key you want to update.
     * @return Boolean about if the modification is successful.
     */
    updateKeyByIterator(iter: TreeIterator<K, V>, _key: K): boolean;
    eraseElementByPos(pos: number): void;
    /**
     * @description Remove the element of the specified _key.
     * @param _key The _key you want to remove.
     */
    eraseElementByKey(_key: K): void;
    eraseElementByIterator(iter: TreeIterator<K, V>): TreeIterator<K, V>;
    /**
     * @description Get the height of the tree.
     * @return Number about the height of the RB-tree.
     */
    getHeight(): number;
}
export default TreeContainer;
