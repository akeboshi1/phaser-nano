import ISprite from '../gameobjects/ISprite';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Alphable = Constructor<ISprite>;
export declare function QuadAlphaComponent<TBase extends Alphable>(Base: TBase): new () => Object;
export interface IQuadAlphaComponent {
    alpha: number;
    vertexAlpha: Float32Array;
    setAlpha(topLeft: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;
}
export {};
//# sourceMappingURL=QuadAlphaComponent.d.ts.map