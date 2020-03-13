import Scene from '../Scene';
import IAnimatedSprite from './IAnimatedSprite';
declare const AnimatedSprite_base: any;
export default class AnimatedSprite extends AnimatedSprite_base {
    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number);
}
export default interface AnimatedSprite extends IAnimatedSprite {
}
export {};
//# sourceMappingURL=AnimatedSprite.d.ts.map