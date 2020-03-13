import Scene from '../Scene';
import IGameObject from './IGameObject';
declare const GameObject_base: any;
export default class GameObject extends GameObject_base {
    constructor(scene: Scene, x?: number, y?: number);
}
export default interface GameObject extends IGameObject {
}
export {};
//# sourceMappingURL=GameObject.d.ts.map