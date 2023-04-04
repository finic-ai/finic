import SequentialContainer from './Base';
import { initContainer } from "../ContainerBase";
import { RandomIterator } from "./Base/RandomIterator";
export declare class DequeIterator<T> extends RandomIterator<T> {
    copy(): DequeIterator<T>;
}
declare class Deque<T> extends SequentialContainer<T> {
    constructor(container?: initContainer<T>, _bucketSize?: number);
    clear(): void;
    front(): T | undefined;
    back(): T | undefined;
    begin(): DequeIterator<T>;
    end(): DequeIterator<T>;
    rBegin(): DequeIterator<T>;
    rEnd(): DequeIterator<T>;
    pushBack(element: T): void;
    popBack(): void;
    /**
     * @description Push the element to the front.
     * @param element The element you want to push.
     */
    pushFront(element: T): void;
    /**
     * @description Remove the _first element.
     */
    popFront(): void;
    forEach(callback: (element: T, index: number) => void): void;
    getElementByPos(pos: number): T;
    setElementByPos(pos: number, element: T): void;
    insert(pos: number, element: T, num?: number): void;
    /**
     * @description Remove all elements after the specified position (excluding the specified position).
     * @param pos The previous position of the _first removed element.
     * @example deque.cut(1); // Then deque's size will be 2. deque -> [0, 1]
     */
    cut(pos: number): void;
    eraseElementByPos(pos: number): void;
    eraseElementByValue(value: T): void;
    eraseElementByIterator(iter: DequeIterator<T>): DequeIterator<T>;
    find(element: T): DequeIterator<T>;
    reverse(): void;
    unique(): void;
    sort(cmp?: (x: T, y: T) => number): void;
    /**
     * @description Remove as much useless space as possible.
     */
    shrinkToFit(): void;
    [Symbol.iterator](): Generator<T, void, unknown>;
}
export default Deque;
