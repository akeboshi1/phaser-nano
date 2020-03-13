import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Positionable = Constructor<ITransformComponent>;
export declare function PositionComponent<TBase extends Positionable>(Base: TBase): new () => Object;
export interface IPositionComponent {
    x: number;
    y: number;
    setPosition(x: number, y?: number): this;
}
export {};
//# sourceMappingURL=PositionComponent.d.ts.map