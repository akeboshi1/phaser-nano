import WebGLRenderer from '../renderer/WebGLRenderer';
import Frame from './Frame';
export default class Texture {
    key: string;
    width: number;
    height: number;
    image: TexImageSource;
    renderer: WebGLRenderer;
    glTexture: WebGLTexture;
    glIndex: number;
    glIndexCounter: number;
    firstFrame: Frame;
    frames: Map<string | number, Frame>;
    constructor(key: string, image: TexImageSource);
    add(key: string | number, x: number, y: number, width: number, height: number): Frame;
    get(key?: string | number | Frame): Frame;
    getFrames(frames: string[] | number[]): Frame[];
    getFramesInRange(prefix: string, start: number, end: number, zeroPad?: number, suffix?: string): Frame[];
}
//# sourceMappingURL=Texture.d.ts.map