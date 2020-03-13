import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Scaleable = Constructor<ITransformComponent>;
export declare function ScaleComponent<TBase extends Scaleable>(Base: TBase): new () => Object;
export interface IScaleComponent {
    scaleX: number;
    scaleY: number;
    setScale(scaleX: number, scaleY?: number): this;
}
export {};
//# sourceMappingURL=ScaleComponent.d.ts.map