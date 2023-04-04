import { ContainerIterator } from "../../ContainerBase";
declare abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
    pre: () => this;
    next: () => this;
    /**
     * @description Get the sequential index of the iterator in the tree container.<br/>
     *              <strong>
     *                Note:
     *              </strong>
     *              This function only takes effect when the specified tree container `enableIndex = true`.
     */
    get index(): number;
    equals(obj: TreeIterator<K, V>): boolean;
}
export default TreeIterator;
