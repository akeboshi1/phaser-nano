import { IContainerComponent } from './ContainerComponent';
import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Transformable = Constructor<ITransformComponent>;
export declare function ParentComponent<TBase extends Transformable>(Base: TBase): {
    new (...args: any[]): {
        parent?: IContainerComponent;
        isParent: boolean;
        setParent(parent?: IContainerComponent): any;
        update(dt?: number, now?: number): void;
        localTransform: import("../math/IMatrix2d").default;
        worldTransform: import("../math/IMatrix2d").default;
        updateCache(): any;
        updateTransform(): any;
        localToGlobal(x: number, y: number, outPoint?: import("../math/Vec2").default): import("../math/Vec2").default;
        globalToLocal(x: number, y: number, outPoint?: import("../math/Vec2").default): import("../math/Vec2").default;
    };
} & TBase;
export interface IParentComponent {
    parent?: IContainerComponent;
    isParent: boolean;
    setParent(parent?: IContainerComponent): this;
    update(dt?: number, now?: number): void;
}
export {};
//# sourceMappingURL=ParentComponent.d.ts.map