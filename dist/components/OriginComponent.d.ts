declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function OriginComponent<TBase extends Constructor>(Base: TBase): new () => Object;
export interface IOriginComponent {
    originX: number;
    originY: number;
    setOrigin(originX: number, originY: number): this;
}
export {};
//# sourceMappingURL=OriginComponent.d.ts.map