import WebGLRenderer from './WebGLRenderer';
import ISprite from '../gameobjects/ISprite';
import ISpriteMultiShader from './ISpriteMultiShader';
import Camera from '../gameobjects/Camera';
export default class MultiTextureQuadShader {
    renderer: WebGLRenderer;
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    attribs: {
        position: number;
        textureCoord: number;
        textureIndex: number;
        color: number;
    };
    uniforms: {
        projectionMatrix: WebGLUniformLocation;
        cameraMatrix: WebGLUniformLocation;
        textureLocation: WebGLUniformLocation;
    };
    /**
     * Maximum number of quads per batch before a flush takes place.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    batchSize: number;
    /**
     * The size, in bytes, per entry in the array buffer.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    dataSize: number;
    /**
     * The size, in bytes, per entry in the element index array.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    indexSize: number;
    /**
     * The amount of elements / floats a single vertex consists of.
     *
     * The default is 6:
     *
     * position (x,y - 2 floats)
     * texture coord (x,y - 2 floats)
     * texture index (float)
     * packed color (vec4)
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    vertexElementSize: number;
    /**
     * The size, in bytes, of a single vertex in the array buffer.
     *
     * This is `vertexElementSize * dataSize`.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    vertexByteSize: number;
    /**
     * The size, in bytes, of a single quad in the array buffer.
     *
     * This is `vertexByteSize * 4`.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    quadByteSize: number;
    /**
     * The size, in quantity of elements, of a single quad in the element index array.
     *
     * This is `vertexElementSize * 4`.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    quadElementSize: number;
    /**
     * The total number of entries per quad in the element index array.
     *
     * The IBO contains 6 entries per quad:
     *
     * 0, 1, 2
     * 2, 3, 0
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    quadIndexSize: number;
    /**
     * The size, in bytes, of the Array Buffer.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    bufferByteSize: number;
    /**
     * The Array Buffer.
     *
     * @type {ArrayBuffer}
     * @memberof MultiTextureQuadShader
     */
    data: ArrayBuffer;
    /**
     * Float32 View of the Array Buffer.
     *
     * @type {Float32Array}
     * @memberof MultiTextureQuadShader
     */
    vertexViewF32: Float32Array;
    /**
     * Uint32 View of the Array Buffer.
     *
     * @type {Uint32Array}
     * @memberof MultiTextureQuadShader
     */
    vertexViewU32: Uint32Array;
    /**
     * The Element Array Buffer.
     *
     * @type {Uint16Array}
     * @memberof MultiTextureQuadShader
     */
    index: Uint16Array;
    /**
     * The data array buffer.
     *
     * @type {WebGLBuffer}
     * @memberof MultiTextureQuadShader
     */
    vertexBuffer: WebGLBuffer;
    /**
     * The element array buffer.
     *
     * @type {WebGLBuffer}
     * @memberof MultiTextureQuadShader
     */
    indexBuffer: WebGLBuffer;
    /**
     * The total number of quads added to the batch so far.
     * Reset every bind and flush.
     *
     * @type {number}
     * @memberof MultiTextureQuadShader
     */
    count: number;
    constructor(renderer: WebGLRenderer, config?: ISpriteMultiShader);
    createBuffers(): void;
    createShaders(fragmentShaderSource: string, vertexShaderSource: string): void;
    bind(camera: Camera): void;
    bindBuffers(indexBuffer: WebGLBuffer, vertexBuffer: WebGLBuffer): void;
    batchSprite(sprite: ISprite): void;
    flush(): void;
}
//# sourceMappingURL=MultiTextureQuadShader.d.ts.map