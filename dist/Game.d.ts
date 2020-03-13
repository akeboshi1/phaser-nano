import WebGLRenderer from './renderer/WebGLRenderer';
import Loader from './loader/Loader';
import SceneManager from './scenes/SceneManager';
import TextureManager from './textures/TextureManager';
import IGameConfig from './IGameConfig';
import EventEmitter from './core/EventEmitter';
export default class Game extends EventEmitter {
    VERSION: string;
    config: IGameConfig;
    isPaused: boolean;
    isBooted: boolean;
    loader: Loader;
    scenes: SceneManager;
    textures: TextureManager;
    renderer: WebGLRenderer;
    private lastTick;
    lifetime: number;
    elapsed: number;
    frame: number;
    dirtyFrame: number;
    totalFrame: number;
    constructor(config?: IGameConfig);
    pause(): void;
    resume(): void;
    boot(): void;
    start(): void;
    banner(version: string): void;
    step(): void;
    destroy(): void;
}
//# sourceMappingURL=Game.d.ts.map