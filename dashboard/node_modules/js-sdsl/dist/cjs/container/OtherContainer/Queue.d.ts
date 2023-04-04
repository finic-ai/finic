import { Base, initContainer } from "../ContainerBase";
declare class Queue<T> extends Base {
    constructor(container?: initContainer<T>);
    clear(): void;
    /**
     * @description Inserts element to queue's end.
     */
    push(element: T): void;
    /**
     * @description Removes the first element.
     */
    pop(): void;
    /**
     * @description Access the first element.
     */
    front(): T | undefined;
}
export default Queue;
