import Scene from '../Scene';
import ISprite from './ISprite';
declare const Sprite_base: any;
export default class Sprite extends Sprite_base {
    vertexData: Float32Array;
    vertexColor: Uint32Array;
    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number);
    packColors(): this;
    updateVertices(F32: Float32Array, U32: Uint32Array, offset: number): void;
}
export default interface Sprite extends ISprite {
}
export {};
//# sourceMappingURL=Sprite.d.ts.map