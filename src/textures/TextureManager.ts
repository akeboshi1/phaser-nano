import Texture from './Texture';
import Game from '../Game';
// import AtlasParser from './AtlasParser';

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

    /*
    addAtlas (key: string, source: HTMLImageElement, atlasData: Object): Texture
    {
        let texture = null;

        if (!this.textures.has(key))
        {
            texture = new Texture(key, source);

            texture.glTexture = this.game.renderer.createGLTexture(texture.image);

            AtlasParser(texture, atlasData);

            this.textures.set(key, texture);
        }

        return texture;
    }
    */
}