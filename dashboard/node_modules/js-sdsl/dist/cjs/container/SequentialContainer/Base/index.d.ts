import { Container } from "../../ContainerBase";
declare abstract class SequentialContainer<T> extends Container<T> {
    /**
     * @description Push the element to the back.
     * @param element The element you want to push.
     */
    abstract pushBack(element: T): void;
    /**
     * @description Removes the last element.
     */
    abstract popBack(): void;
    /**
     * @description Sets element by position.
     * @param pos The position you want to change.
     * @param element The element's value you want to update.
     */
    abstract setElementByPos(pos: number, element: T): void;
    /**
     * @description Removes the elements of the specified value.
     * @param value The value you want to remove.
     */
    abstract eraseElementByValue(value: T): void;
    /**
     * @description Insert several elements after the specified position.
     * @param pos The position you want to insert.
     * @param element The element you want to insert.
     * @param num The number of elements you want to insert (default 1).
     */
    abstract insert(pos: number, element: T, num?: number): void;
    /**
     * @description Reverses the container.
     */
    abstract reverse(): void;
    /**
     * @description Removes the duplication of elements in the container.
     */
    abstract unique(): void;
    /**
     * @description Sort the container.
     * @param cmp Comparison function.
     */
    abstract sort(cmp?: (x: T, y: T) => number): void;
}
export default SequentialContainer;
