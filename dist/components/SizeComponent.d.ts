declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function SizeComponent<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        width: number;
        height: number;
        setSize(width: number, height: number): any;
    };
} & TBase;
export interface ISizeComponent {
    width: number;
    height: number;
    setSize(width: number, height: number): this;
}
export {};
//# sourceMappingURL=SizeComponent.d.ts.map