import { ISceneComponent } from './SceneComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type SceneChild = Constructor<ISceneComponent>;
export declare function DirtyComponent<TBase extends SceneChild>(Base: TBase): {
    new (...args: any[]): {
        dirty: boolean;
        dirtyFrame: number;
        setDirty(setFrame?: boolean): any;
        scene: import("../Scene").default;
        setScene(scene: import("../Scene").default): any;
    };
} & TBase;
export interface IDirtyComponent {
    dirty: boolean;
    dirtyFrame: number;
    setDirty(setFrame?: boolean): this;
}
export {};
//# sourceMappingURL=DirtyComponent.d.ts.map