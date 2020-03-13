import { IDirtyComponent } from './DirtyComponent';
import { IPositionComponent } from './PositionComponent';
import { IRotationComponent } from './RotationComponent';
import { IScaleComponent } from './ScaleComponent';
import { ISkewComponent } from './SkewComponent';
import IContainerChild from '../gameobjects/IContainerChild';
import IMatrix2d from '../math/IMatrix2d';
import Vec2 from '../math/Vec2';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Transformable = Constructor<IDirtyComponent & IContainerChild & IPositionComponent & IRotationComponent & IScaleComponent & ISkewComponent>;
export declare function TransformComponent<TBase extends Transformable>(Base: TBase): {
    new (...args: any[]): {
        localTransform: IMatrix2d;
        worldTransform: IMatrix2d;
        updateCache(): any;
        updateTransform(): any;
        localToGlobal(x: number, y: number, outPoint?: Vec2): Vec2;
        globalToLocal(x: number, y: number, outPoint?: Vec2): Vec2;
        dirty: boolean;
        dirtyFrame: number;
        setDirty(setFrame?: boolean): any;
        parent?: import("./ContainerComponent").IContainerComponent;
        isParent: boolean;
        setParent(parent?: import("./ContainerComponent").IContainerComponent): any;
        update(dt?: number, now?: number): void;
        renderable: boolean;
        setRenderable: (value: boolean) => any;
        willRender: () => boolean;
        x: number;
        y: number;
        setPosition(x: number, y?: number): any;
        rotation: number;
        setRotation(value: number): any;
        scaleX: number;
        scaleY: number;
        setScale(scaleX: number, scaleY?: number): any;
        skewX: number;
        skewY: number;
        setSkew(skewX: number, skewY?: number): any;
    };
} & TBase;
export interface ITransformComponent {
    localTransform: IMatrix2d;
    worldTransform: IMatrix2d;
    updateCache(): this;
    updateTransform(): this;
    localToGlobal(x: number, y: number, outPoint?: Vec2): Vec2;
    globalToLocal(x: number, y: number, outPoint?: Vec2): Vec2;
}
export {};
//# sourceMappingURL=TransformComponent.d.ts.map