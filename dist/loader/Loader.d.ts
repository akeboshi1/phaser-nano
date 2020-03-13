import File from './File';
import Game from '../Game';
import IFrameConfig from '../textures/IFrameConfig';
export default class Loader {
    game: Game;
    baseURL: string;
    path: string;
    crossOrigin: string | undefined;
    maxParallelDownloads: number;
    isLoading: boolean;
    queue: File[];
    inflight: Map<string, File>;
    onComplete: Function;
    constructor(game: Game);
    reset(): void;
    start(onComplete: Function): void;
    nextFile(): void;
    stop(): void;
    fileComplete(file: File): void;
    fileError(file: File): void;
    totalFilesToLoad(): number;
    image(key: string, url?: string): this;
    spritesheet(key: string, url: string, frameConfig: IFrameConfig): this;
    atlas(key: string, textureURL?: string, atlasURL?: string): this;
    json(key: string, url?: string): this;
    csv(key: string, url?: string): this;
    XHRLoader(file: File): void;
    imageTagLoader(file: File): void;
    getURL(key: string, url: string, extension: string): string;
    setBaseURL(url: string): this;
    setPath(path: string): this;
    setCORS(crossOrigin: any): this;
}
//# sourceMappingURL=Loader.d.ts.map