import Scene from '../Scene';
import IContainer from './IContainer';
declare const Container_base: any;
export default class Container extends Container_base {
    constructor(scene: Scene, x?: number, y?: number);
    update(dt: number, now: number): void;
    preRender(dt: number, now: number): void;
    updateTransform(): this;
}
export default interface Container extends IContainer {
}
export {};
//# sourceMappingURL=Container.d.ts.map