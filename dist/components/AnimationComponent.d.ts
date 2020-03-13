import IAnimationData from './IAnimationData';
import IAnimationPlayConfig from './IAnimationPlayConfig';
import Frame from '../textures/Frame';
import { ITextureComponent } from './TextureComponent';
import { IParentComponent } from './ParentComponent';
declare type Constructor<T = {}> = new (...args: any[]) => T;
declare type Animateable = Constructor<ITextureComponent & IParentComponent>;
export declare function AnimationComponent<TBase extends Animateable>(Base: TBase): {
    new (...args: any[]): {
        anims: Map<string, Frame[]>;
        animData: IAnimationData;
        addAnimation(key: string, frames: string[] | number[]): any;
        addAnimationFromAtlas(key: string, prefix: string, start: number, end: number, zeroPad?: number, suffix?: string): any;
        removeAnimation(key: string): any;
        clearAnimations(): any;
        play(key: string, config?: IAnimationPlayConfig): any;
        stop(): any;
        nextFrame(): any;
        prevFrame(): any;
        update(delta: number, now: number): void;
        readonly isPlaying: boolean;
        readonly isPlayingForward: boolean;
        readonly currentAnimation: string;
        texture: import("../textures/Texture").default;
        frame: Frame;
        hasTexture: boolean;
        setTexture(key: string | import("../textures/Texture").default, frame?: string | number): any;
        setFrame(key?: string | number | Frame): any;
        parent?: import("./ContainerComponent").IContainerComponent;
        isParent: boolean;
        setParent(parent?: import("./ContainerComponent").IContainerComponent): any;
    };
} & TBase;
export interface IAnimationComponent {
    anims: Map<string, Frame[]>;
    animData: IAnimationData;
    addAnimation(key: string, frames: string[] | number[]): this;
    addAnimationFromAtlas(key: string, prefix: string, start: number, end: number, zeroPad?: number, suffix?: string): this;
    removeAnimation(key: string): this;
    clearAnimations(): this;
    play(key: string, config?: IAnimationPlayConfig): this;
    stop(): this;
    nextFrame(): this;
    prevFrame(): this;
    update(delta?: number, now?: number): void;
    isPlaying: boolean;
    isPlayingForward: boolean;
    currentAnimation: string;
}
export {};
//# sourceMappingURL=AnimationComponent.d.ts.map