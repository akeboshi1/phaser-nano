import CreateCanvas from './CreateCanvas';
import Texture from './Texture';

export default function GridTexture (color1: string, color2: string, width: number = 32, height: number = 32, cols: number = 2, rows: number = 2): Texture
{
    const ctx = CreateCanvas(width, height);

    const colWidth = width / cols;
    const rowHeight = height / rows;

    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = color2;

    for (let y: number = 0; y < rows; y++)
    {
        for (let x: number = (y % 2); x < cols; x += 2)
        {
            ctx.fillRect(x * colWidth, y * rowHeight, colWidth, rowHeight);
        }
    }

    return new Texture(ctx.canvas);
}
