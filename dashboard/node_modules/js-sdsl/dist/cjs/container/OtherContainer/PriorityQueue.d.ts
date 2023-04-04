import { Base, initContainer } from "../ContainerBase";
declare class PriorityQueue<T> extends Base {
    /**
     * @description PriorityQueue's constructor.
     * @param container Initialize container, must have a forEach function.
     * @param cmp Compare function.
     * @param copy When the container is an array, you can choose to directly operate on the original object of
     *             the array or perform a shallow copy. The default is shallow copy.
     */
    constructor(container?: initContainer<T>, cmp?: (x: T, y: T) => number, copy?: boolean);
    clear(): void;
    /**
     * @description Push element into a container in order.
     * @param item The element you want to push.
     */
    push(item: T): void;
    /**
     * @description Removes the top element.
     */
    pop(): void;
    /**
     * @description Accesses the top element.
     */
    top(): T | undefined;
    /**
     * @description Check if element is in heap.
     * @param item The item want to find.
     * @return Boolean about if element is in heap.
     */
    find(item: T): boolean;
    /**
     * @description Remove specified item from heap.
     * @param item The item want to remove.
     * @return Boolean about if remove success.
     */
    remove(item: T): boolean;
    /**
     * @description Update item and it's pos in the heap.
     * @param item The item want to update.
     * @return Boolean about if update success.
     */
    updateItem(item: T): boolean;
    /**
     * @return Return a copy array of heap.
     */
    toArray(): T[];
}
export default PriorityQueue;
