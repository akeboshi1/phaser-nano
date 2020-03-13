import Texture from './Texture';
export default class Frame {
    texture: Texture;
    key: string | number;
    x: number;
    y: number;
    width: number;
    height: number;
    trimmed: boolean;
    sourceSizeWidth: number;
    sourceSizeHeight: number;
    spriteSourceSizeX: number;
    spriteSourceSizeY: number;
    spriteSourceSizeWidth: number;
    spriteSourceSizeHeight: number;
    pivot: {
        x: number;
        y: number;
    };
    u0: number;
    v0: number;
    u1: number;
    v1: number;
    constructor(texture: Texture, key: string | number, x: number, y: number, width: number, height: number);
    setPivot(x: number, y: number): void;
    setSourceSize(width: number, height: number): void;
    setTrim(width: number, height: number, x: number, y: number, w: number, h: number): void;
    updateUVs(): void;
}
//# sourceMappingURL=Frame.d.ts.map