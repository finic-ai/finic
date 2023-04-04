import { ContainerIterator } from "../../ContainerBase";
export declare abstract class RandomIterator<T> extends ContainerIterator<T> {
    pre: () => this;
    next: () => this;
    get pointer(): T;
    set pointer(newValue: T);
    equals(obj: RandomIterator<T>): boolean;
}
