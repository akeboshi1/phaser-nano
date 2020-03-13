import IMatrix2d from '../math/IMatrix2d';
import IContainerChild from '../gameobjects/IContainerChild';
import { IParentComponent } from './ParentComponent';
import { ITransformComponent } from './TransformComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Transformable = Constructor<ITransformComponent & IParentComponent>;
export declare function ContainerComponent<TBase extends Transformable>(Base: TBase): {
    new (...args: any[]): {
        children: IContainerChild[];
        getChildren(): IContainerChild[];
        addChild(...child: IContainerChild[]): any;
        addChildAt(child: IContainerChild, index: number): IContainerChild;
        swapChildren(child1: IContainerChild, child2: IContainerChild): any;
        getChildIndex(child: IContainerChild): number;
        setChildIndex(child: IContainerChild, index: number): any;
        getChildAt(index: number): IContainerChild;
        removeChild(child: IContainerChild): IContainerChild;
        removeChildAt(index: number): IContainerChild;
        removeChildren(beginIndex?: number, endIndex?: number): IContainerChild[];
        update(dt?: number, now?: number): void;
        readonly numChildren: number;
        localTransform: IMatrix2d;
        worldTransform: IMatrix2d;
        updateCache(): any;
        updateTransform(): any;
        localToGlobal(x: number, y: number, outPoint?: import("../math/Vec2").default): import("../math/Vec2").default;
        globalToLocal(x: number, y: number, outPoint?: import("../math/Vec2").default): import("../math/Vec2").default;
        parent?: IContainerComponent;
        isParent: boolean;
        setParent(parent?: IContainerComponent): any;
    };
} & TBase;
export interface IContainerComponent {
    children: IContainerChild[];
    isParent: boolean;
    numChildren: number;
    worldTransform: IMatrix2d;
    getChildren(): IContainerChild[];
    addChild(...child: IContainerChild[]): this;
    addChildAt(child: IContainerChild, index: number): IContainerChild;
    swapChildren(child1: IContainerChild, child2: IContainerChild): this;
    getChildIndex(child: IContainerChild): number;
    setChildIndex(child: IContainerChild, index: number): this;
    getChildAt(index: number): IContainerChild;
    removeChild(child: IContainerChild): IContainerChild;
    removeChildAt(index: number): IContainerChild;
    removeChildren(beginIndex: number, endIndex?: number): IContainerChild[];
    update(dt?: number, now?: number): void;
}
export {};
//# sourceMappingURL=ContainerComponent.d.ts.map