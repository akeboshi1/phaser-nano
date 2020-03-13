import Texture from '../textures/Texture';
import Frame from '../textures/Frame';
import ISprite from '../gameobjects/ISprite';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Sprite = Constructor<ISprite>;
export declare function TextureComponent<TBase extends Sprite>(Base: TBase): new () => Object;
export interface ITextureComponent {
    texture: Texture;
    frame: Frame;
    hasTexture: boolean;
    setTexture(key: string | Texture, frame?: string | number): this;
    setFrame(key?: string | number | Frame): this;
}
export {};
//# sourceMappingURL=TextureComponent.d.ts.map