/**
 * TypeScript port of @nimiq/core/src/main/generic/utils/Observable.js
 */
export default class Observable {
    static get WILDCARD(): string;
    protected _listeners: Map<string, Array<(...args: any) => any>>;
    constructor();
    on<T>(type: string, callback: (arg: T) => any): number;
    off(type: string, id: number): void;
    fire(type: string, ...args: any[]): Promise<any[]> | null;
    bubble(observable: Observable, ...types: string[]): void;
    protected _offAll(): void;
}
