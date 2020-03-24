import Texture from './Texture';
import ISprite from '../gameobjects/ISprite';
import WebGLRenderer from '../renderer/WebGLRenderer';
import Ortho from '../renderer/Ortho';
import CreateFramebuffer from '../renderer/CreateFramebuffer';
import GL from '../renderer/GL';

export default class RenderTexture extends Texture
{
    renderer: WebGLRenderer;
    cameraMatrix: Float32Array;
    projectionMatrix: Float32Array;

    constructor (renderer: WebGLRenderer, width: number = 256, height: number = width)
    {
        super(null, width, height);

        this.renderer = renderer;

        const [ texture, framebuffer ] = CreateFramebuffer(GL.get(), width, height);

        this.glTexture = texture;
        this.glFramebuffer = framebuffer;

        this.projectionMatrix = Ortho(width, height);
        this.cameraMatrix = new Float32Array([ 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, height, 0, 1 ]);
    }

    cls (): this
    {
        const renderer = this.renderer;
        const gl = renderer.gl;

        renderer.reset(this.glFramebuffer, this.width, this.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        renderer.reset();

        return this;
    }

    batchStart (): this
    {
        const renderer = this.renderer;

        renderer.reset(this.glFramebuffer, this.width, this.height);

        renderer.shader.bind(this.projectionMatrix, this.cameraMatrix);

        return this;
    }

    batchDraw (...sprites: ISprite[]): this
    {
        const renderer = this.renderer;
        const shader = renderer.shader;

        for (let i: number = 0; i < sprites.length; i++)
        {
            sprites[i].renderWebGL(renderer, shader, renderer.startActiveTexture);
        }

        return this;
    }

    batchEnd (): this
    {
        const renderer = this.renderer;
        const shader = renderer.shader;

        shader.flush();

        renderer.reset();

        return this;
    }

    draw (...sprites: ISprite[]): this
    {
        this.batchStart();
        this.batchDraw(...sprites);
        this.batchEnd();

        return this;
    }
}
