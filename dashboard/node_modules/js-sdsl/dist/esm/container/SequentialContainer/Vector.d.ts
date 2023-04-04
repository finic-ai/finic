import SequentialContainer from './Base';
import { initContainer } from "../ContainerBase";
import { RandomIterator } from "./Base/RandomIterator";
export declare class VectorIterator<T> extends RandomIterator<T> {
    copy(): VectorIterator<T>;
}
declare class Vector<T> extends SequentialContainer<T> {
    /**
     * @description Vector's constructor.
     * @param container Initialize container, must have a forEach function.
     * @param copy When the container is an array, you can choose to directly operate on the original object of
     *             the array or perform a shallow copy. The default is shallow copy.
     */
    constructor(container?: initContainer<T>, copy?: boolean);
    clear(): void;
    begin(): VectorIterator<T>;
    end(): VectorIterator<T>;
    rBegin(): VectorIterator<T>;
    rEnd(): VectorIterator<T>;
    front(): T | undefined;
    back(): T | undefined;
    forEach(callback: (element: T, index: number) => void): void;
    getElementByPos(pos: number): T;
    eraseElementByPos(pos: number): void;
    eraseElementByValue(value: T): void;
    eraseElementByIterator(iter: VectorIterator<T>): VectorIterator<T>;
    pushBack(element: T): void;
    popBack(): void;
    setElementByPos(pos: number, element: T): void;
    insert(pos: number, element: T, num?: number): void;
    find(element: T): VectorIterator<T>;
    reverse(): void;
    unique(): void;
    sort(cmp?: (x: T, y: T) => number): void;
    [Symbol.iterator](): Generator<T, any, undefined>;
}
export default Vector;
