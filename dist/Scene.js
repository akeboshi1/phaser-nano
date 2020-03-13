import Camera from './gameobjects/Camera';
import World from './gameobjects/World';
export default class Scene {
    constructor(game) {
        this.game = game;
        this.load = game.loader;
        this.textures = game.textures;
        this.world = new World(this);
        this.camera = new Camera(this, 0, 0);
    }
    init() {
    }
    preload() {
    }
    create() {
    }
    update(delta, time) {
    }
}
//# sourceMappingURL=Scene.js.map