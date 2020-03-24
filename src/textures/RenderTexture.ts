import Texture from './Texture';
import Scene from '../Scene';
import ISprite from '../gameobjects/ISprite';
import WebGLRenderer from '../renderer/WebGLRenderer';

export default class RenderTexture extends Texture
{
    renderer: WebGLRenderer;
    cameraMatrix: Float32Array;
    projectionMatrix: Float32Array;

    constructor (scene: Scene, key: string, width: number = 256, height: number = 256)
    {
        super(key, null, width, height);

        this.renderer = scene.game.renderer;

        const [ texture, framebuffer ] = this.renderer.createFramebuffer(width, height);

        this.glTexture = texture;
        this.glFramebuffer = framebuffer;

        this.projectionMatrix = this.renderer.ortho(width, height, -10000, 10000);
        this.cameraMatrix = new Float32Array([ 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, height, 0, 1 ]);
    }

    cls (red: number = 0, green: number = 0, blue: number = 0, alpha: number = 0): this
    {
        const renderer = this.renderer;
        const gl = renderer.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);

        // gl.viewport(0, 0, this.width, this.height);

        gl.clearColor(red, green, blue, alpha);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this;
    }

    batchStart (): this
    {
        const renderer = this.renderer;
        const gl = renderer.gl;
        const shader = renderer.shader;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer);

        renderer.currentActiveTexture = 0;
        renderer.startActiveTexture++;

        shader.bind(this.projectionMatrix, this.cameraMatrix);

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
        const gl = renderer.gl;
        const shader = renderer.shader;

        shader.flush();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
