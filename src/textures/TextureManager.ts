import Texture from './Texture';
import Game from '../Game';
import CreateCanvas from './CreateCanvas';

export default class TextureManager
{
    textures: Map<string, Texture>;
    game: Game;

    constructor (game: Game)
    {
        this.game = game;

        this.textures = new Map();

        this.createDefaultTextures();
    }

    private createDefaultTextures ()
    {
        this.add('__BLANK', new Texture('', CreateCanvas(32, 32).canvas));

        const missing = CreateCanvas(32, 32);

        missing.strokeStyle = '#0f0';
        missing.moveTo(0, 0);
        missing.lineTo(32, 32);
        missing.stroke();
        missing.strokeRect(0.5, 0.5, 31, 31);

        this.add('__MISSING', new Texture('', missing.canvas));
    }

    get (key: string): Texture
    {
        if (this.textures.has(key))
        {
            return this.textures.get(key);
        }
        else
        {
            return this.textures.get('__MISSING');
        }
    }

    has (key: string): boolean
    {
        return this.textures.has(key);
    }

    add (key: string, source: Texture | HTMLImageElement)
    {
        let texture: Texture;

        if (!this.textures.has(key))
        {
            if (source instanceof Texture)
            {
                texture = source;
                texture.key = key;
            }
            else
            {
                texture = new Texture(key, source);
            }

            if (!texture.glTexture)
            {
                texture.glTexture = this.game.renderer.createGLTexture(texture.image);
            }

            this.textures.set(key, texture);
        }

        return texture;
    }
}