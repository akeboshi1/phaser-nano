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

    constructor (scene: Scene, x: number, y: number, text: string)
    {
        super(scene, x, y, SolidColorTexture());

        this._text = text;
        this._canvas = this.texture.image as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d');

        this.texture.glTexture = CreateGLTexture(GL.get(), this._canvas);

        this.updateText();
    }

    private updateText ()
    {
        const canvas = this._canvas;
        const ctx = this._ctx;

        let text = this._text;
        let lines = text.split(this.splitRegExp);

        //  GetTextSize()

        const padding = this.padding;

        ctx.font = '16px monospace';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#ff0000';
        ctx.fillText(this._text, 0, 10);

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
