import MultiTextureQuadShader from './MultiTextureQuadShader';
import Texture from '../textures/Texture';
import Camera from '../gameobjects/Camera';
import IRenderable from '../gameobjects/IRenderable';
export default class WebGLRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    contextOptions: WebGLContextAttributes;
    clearColor: number[];
    shader: MultiTextureQuadShader;
    width: number;
    height: number;
    resolution: number;
    projectionMatrix: Float32Array;
    textureIndex: number[];
    maxTextures: number;
    activeTextures: Texture[];
    currentActiveTexture: number;
    startActiveTexture: number;
    clearBeforeRender: boolean;
    optimizeRedraw: boolean;
    autoResize: boolean;
    contextLost: boolean;
    elementIndexExtension: OES_element_index_uint;
    constructor(width: number, height: number, resolution?: number);
    initContext(): void;
    resize(width: number, height: number, resolution?: number): void;
    ortho(width: number, height: number, near: number, far: number): Float32Array;
    onContextLost(event: any): void;
    onContextRestored(): void;
    setBackgroundColor(color: number): this;
    private getMaxTextures;
    isSizePowerOfTwo(width: number, height: number): boolean;
    createGLTexture(source: TexImageSource): WebGLTexture;
    render(list: IRenderable[], camera: Camera, dirtyFrame: number): void;
}
//# sourceMappingURL=WebGLRenderer.d.ts.map