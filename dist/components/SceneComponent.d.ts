import Scene from '../Scene';
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare function SceneComponent<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        scene: Scene;
        setScene(scene: Scene): any;
    };
} & TBase;
export interface ISceneComponent {
    scene: Scene;
    setScene(scene: Scene): this;
}
export {};
//# sourceMappingURL=SceneComponent.d.ts.map