import CreateCanvas from './CreateCanvas';
import Texture from './Texture';

export default function SolidColorTexture (color: string = 'rgba(0,0,0,0)', width: number = 32, height: number = 32): Texture
{
    const ctx = CreateCanvas(width, height);

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    return new Texture(ctx.canvas);
}
