import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Rotateable = Constructor<ITransformComponent>;
export declare function RotationComponent<TBase extends Rotateable>(Base: TBase): new () => Object;
export interface IRotationComponent {
    rotation: number;
    setRotation(value: number): this;
}
export {};
//# sourceMappingURL=RotationComponent.d.ts.map