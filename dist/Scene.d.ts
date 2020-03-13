import Game from './Game';
import Loader from './loader/Loader';
import TextureManager from './textures/TextureManager';
import Camera from './gameobjects/Camera';
import World from './gameobjects/World';
export default class Scene {
    camera: Camera;
    game: Game;
    load: Loader;
    textures: TextureManager;
    world: World;
    constructor(game: Game);
    init(): void;
    preload(): void;
    create(): void;
    update(delta?: number, time?: number): void;
}
//# sourceMappingURL=Scene.d.ts.map