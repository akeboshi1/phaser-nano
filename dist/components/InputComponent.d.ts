import IInteractiveArea from './IInteractiveArea';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function InputComponent<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        inputEnabled: boolean;
        inputEnabledChildren: boolean;
        inputHitArea: IInteractiveArea;
        setInteractive(hitArea?: IInteractiveArea): any;
    };
} & TBase;
export interface IInputComponent {
    inputEnabled: boolean;
    inputEnabledChildren: boolean;
    inputHitArea?: IInteractiveArea;
    setInteractive(hitArea?: IInteractiveArea): this;
}
export {};
//# sourceMappingURL=InputComponent.d.ts.map