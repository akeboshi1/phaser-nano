import Texture from './Texture';
import SpriteSheetParser from './SpriteSheetParser';
import AtlasParser from './AtlasParser';
export default class TextureManager {
    constructor(game) {
        this.game = game;
        this.textures = new Map();
    }
    get(key) {
        if (this.textures.has(key)) {
            return this.textures.get(key);
        }
        else {
            return this.textures.get('__MISSING');
        }
    }
    addImage(key, source) {
        let texture = null;
        if (!this.textures.has(key)) {
            texture = new Texture(key, source);
            texture.glTexture = this.game.renderer.createGLTexture(texture.image);
            this.textures.set(key, texture);
        }
        return texture;
    }
    addSpriteSheet(key, source, frameConfig) {
        let texture = null;
        if (!this.textures.has(key)) {
            texture = new Texture(key, source);
            texture.glTexture = this.game.renderer.createGLTexture(texture.image);
            SpriteSheetParser(texture, 0, 0, texture.width, texture.height, frameConfig);
            this.textures.set(key, texture);
        }
        return texture;
    }
    addAtlas(key, source, atlasData) {
        let texture = null;
        if (!this.textures.has(key)) {
            texture = new Texture(key, source);
            texture.glTexture = this.game.renderer.createGLTexture(texture.image);
            AtlasParser(texture, atlasData);
            this.textures.set(key, texture);
        }
        return texture;
    }
    addColor(key, color, width = 32, height = 32) {
        return this.addGrid(key, color, color, width, height, 0, 0);
    }
    addGrid(key, color1, color2, width = 32, height = 32, cols = 2, rows = 2) {
        let texture = null;
        if (!this.textures.has(key)) {
            const ctx = this.createCanvas(width, height);
            const colWidth = width / cols;
            const rowHeight = height / rows;
            ctx.fillStyle = color1;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = color2;
            for (let y = 0; y < rows; y++) {
                for (let x = (y % 2); x < cols; x += 2) {
                    ctx.fillRect(x * colWidth, y * rowHeight, colWidth, rowHeight);
                }
            }
            texture = new Texture(key, ctx.canvas);
            texture.glTexture = this.game.renderer.createGLTexture(texture.image);
            this.textures.set(key, texture);
        }
        return texture;
    }
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext('2d');
    }
}
//# sourceMappingURL=TextureManager.js.map