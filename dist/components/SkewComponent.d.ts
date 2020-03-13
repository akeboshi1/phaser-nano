import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Skewable = Constructor<ITransformComponent>;
export declare function SkewComponent<TBase extends Skewable>(Base: TBase): new () => Object;
export interface ISkewComponent {
    skewX: number;
    skewY: number;
    setSkew(skewX: number, skewY?: number): this;
}
export {};
//# sourceMappingURL=SkewComponent.d.ts.map