import Scene from '../Scene';
import IText from './IText';
import SolidColorTexture from '../textures/SolidColorTexture';
import Sprite from './Sprite';
import CreateGLTexture from '../renderer/CreateGLTexture';
import GL from '../renderer/GL';
import UpdateGLTexture from '../renderer/UpdateGLTexture';

export default class Text extends Sprite
{
    private _text: string;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    
    splitRegExp: RegExp = /(?:\r\n|\r|\n)/;
    padding = { left: 0, right: 0, top: 0, bottom: 0 };
    lineSpacing: number = 0;
    resolution: number;
    font: string = '32px monospace';
    fillStyle: string = '#fff';

    constructor (scene: Scene, x: number, y: number, text: string)
    {
        super(scene, x, y, SolidColorTexture());

        this._text = text;
        this._canvas = this.texture.image as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d');

        this.texture.glTexture = CreateGLTexture(GL.get(), this._canvas, 32, 32, false);

        this.resolution = window.devicePixelRatio || 1;

        this.updateText();
    }

    private updateText ()
    {
        const canvas = this._canvas;
        const ctx = this._ctx;
        const resolution = this.resolution;

        let text = this._text;

        // let lines = text.split(this.splitRegExp);
        // const padding = this.padding;

        ctx.font = this.font;
        // ctx.textBaseline = 'alphabetic';

        const metrics = ctx.measureText(text);

        let width = Math.ceil(metrics.width);
        let height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

        width = Math.max(width * resolution, 1);
        height = Math.max(height * resolution, 1);

        if (canvas.width !== width || canvas.height !== height)
        {
            canvas.width = width;
            canvas.height = height;
    
            this.texture.setSize(width / resolution, height / resolution);
        }

        ctx.save();
        ctx.scale(resolution, resolution);
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.fillText(this._text, 0, metrics.actualBoundingBoxAscent);
        ctx.restore();

        UpdateGLTexture(GL.get(), canvas, this.texture.glTexture);
    }

    setText (value: string | string[])
    {
        if (!value)
        {
            value = '';
        }

        if (Array.isArray(value))
        {
            value = value.join('\n');
        }

        if (value !== this._text)
        {
            this._text = value.toString();

            this.updateText();
        }
    }
}

export default interface Text extends IText {}
