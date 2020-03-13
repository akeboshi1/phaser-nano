import { IAlphaComponent } from './AlphaComponent';
import { ITextureComponent } from './TextureComponent';
import { IVisibleComponent } from './VisibleComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type CanRender = Constructor<IAlphaComponent & ITextureComponent & IVisibleComponent>;
export declare function RenderableComponent<TBase extends CanRender>(Base: TBase): {
    new (...args: any[]): {
        renderable: boolean;
        setRenderable(value: boolean): any;
        willRender(): boolean;
        alpha: number;
        setAlpha(value?: number): any;
        texture: import("../textures/Texture").default;
        frame: import("../textures/Frame").default;
        hasTexture: boolean;
        setTexture(key: string | import("../textures/Texture").default, frame?: string | number): any;
        setFrame(key?: string | number | import("../textures/Frame").default): any;
        visible: boolean;
        setVisible(value: boolean): any;
    };
} & TBase;
export interface IRenderableComponent {
    renderable: boolean;
    setRenderable: (value: boolean) => this;
    willRender: () => boolean;
}
export {};
//# sourceMappingURL=RenderableComponent.d.ts.map