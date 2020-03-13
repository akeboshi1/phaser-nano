import ISprite from '../gameobjects/ISprite';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Tintable = Constructor<ISprite>;
export declare function QuadTintComponent<TBase extends Tintable>(Base: TBase): new () => Object;
export interface IQuadTintComponent {
    tint: number;
    vertexTint: Uint32Array;
    setTint(topLeft: number, topRight?: number, bottomLeft?: number, bottomRight?: number): this;
}
export {};
//# sourceMappingURL=QuadTintComponent.d.ts.map