import Texture from './Texture';
import Game from '../Game';

export default class TextureManager
{
    textures: Map<string, Texture>;
    game: Game;

    constructor (game: Game)
    {
        this.game = game;

        this.textures = new Map();
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

            // TODO: Make this happen at render time
            texture.glTexture = this.game.renderer.createGLTexture(texture.image);

            this.textures.set(key, texture);
        }

        return texture;
    }
}