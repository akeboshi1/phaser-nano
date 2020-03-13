declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function VisibleComponent<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        visible: boolean;
        setVisible(value: boolean): any;
    };
} & TBase;
export interface IVisibleComponent {
    visible: boolean;
    setVisible(value: boolean): this;
}
export {};
//# sourceMappingURL=VisibleComponent.d.ts.map