import * as Components from '../components';
import Texture from '../textures/Texture';
import WebGLRenderer from '../renderer/WebGLRenderer';
import MultiTextureQuadShader from '../renderer/MultiTextureQuadShader';
import ISprite from './ISprite';

export default interface ISpriteBuffer extends
    Components.IDirtyComponent,
    Components.IParentComponent,
    Components.IRenderableComponent,
    Components.ISceneComponent,
    Components.ITransformBypassComponent,
    Components.IVisibleComponent
    {
        data: ArrayBuffer;
        vertexViewF32: Float32Array;
        vertexViewU32: Uint32Array;
        index: Uint16Array | Uint32Array;
        vertexBuffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        size: number;
        maxSize: number;
        quadIndexSize: number;
        indexType: GLenum;
        activeTextures: Texture[];
        gl: WebGLRenderingContext;
        renderer: WebGLRenderer;
        shader: MultiTextureQuadShader;
        resetBuffers (maxSize: number): void;
        render (): void;
        clear (): this;
        add (...sprites: ISprite[]): this;
        addAt (offset: number, ...sprites: ISprite[]): this;
    }
