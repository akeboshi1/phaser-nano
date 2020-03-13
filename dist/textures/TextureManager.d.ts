import Texture from './Texture';
import Game from '../Game';
import IFrameConfig from './IFrameConfig';
export default class TextureManager {
    textures: Map<string, Texture>;
    game: Game;
    constructor(game: Game);
    get(key: string): Texture;
    addImage(key: string, source: HTMLImageElement): Texture;
    addSpriteSheet(key: string, source: HTMLImageElement, frameConfig: IFrameConfig): Texture;
    addAtlas(key: string, source: HTMLImageElement, atlasData: Object): Texture;
    addColor(key: string, color: string, width?: number, height?: number): Texture;
    addGrid(key: string, color1: string, color2: string, width?: number, height?: number, cols?: number, rows?: number): Texture;
    createCanvas(width: number, height: number): CanvasRenderingContext2D;
}
//# sourceMappingURL=TextureManager.d.ts.map