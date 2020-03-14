import CreateCanvas from './CreateCanvas';
import Texture from './Texture';

export default function SolidColorTexture (color: string, width: number = 32, height: number = 32): Texture
{
    let texture = null;

    const ctx = CreateCanvas(width, height);

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    return texture = new Texture('', ctx.canvas);
}
