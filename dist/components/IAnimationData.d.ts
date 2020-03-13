import Frame from '../textures/Frame';
import { IAnimationComponent } from './AnimationComponent';
export default interface IAnimationData {
    currentAnim: string;
    currentFrames: Frame[];
    frameIndex: number;
    animSpeed: number;
    nextFrameTime: number;
    repeatCount: number;
    isPlaying: boolean;
    yoyo: boolean;
    pendingStart: boolean;
    playingForward: boolean;
    delay: number;
    repeatDelay: number;
    onStart?: (sprite: IAnimationComponent, animation: string) => void;
    onRepeat?: (sprite: IAnimationComponent, animation: string) => void;
    onComplete?: (sprite: IAnimationComponent, animation: string) => void;
}
//# sourceMappingURL=IAnimationData.d.ts.map