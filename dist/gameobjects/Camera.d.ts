import WebGLRenderer from '../renderer/WebGLRenderer';
import GameObject from './GameObject';
import Scene from '../Scene';
export default class Camera extends GameObject {
    matrix: Float32Array;
    renderer: WebGLRenderer;
    readonly width: number;
    readonly height: number;
    constructor(scene: Scene, x?: number, y?: number);
    updateTransform(): this;
}
//# sourceMappingURL=Camera.d.ts.map