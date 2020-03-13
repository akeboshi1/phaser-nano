import Scene from '../Scene';
export default class SceneManager {
    constructor(game, sceneConfig) {
        this.game = game;
        this.scenes = new Map();
        this.addScene(sceneConfig);
    }
    update(delta, now) {
        // this.scene.update(dt, now);
        // this.scene.world.update(dt, now);
    }
    render() {
    }
    addScene(sceneConfig) {
        let scene;
        if (sceneConfig instanceof Scene) {
            scene = this.createSceneFromInstance(sceneConfig);
        }
        else if (typeof scene === 'object') {
            scene = this.createSceneFromObject(sceneConfig);
        }
        else if (typeof scene === 'function') {
            scene = this.createSceneFromFunction(sceneConfig);
        }
        const key = (sceneConfig.hasOwnProperty('key')) ? sceneConfig['key'] : 'default';
        this.scenes.set(key, scene);
    }
    createSceneFromInstance(newScene) {
        newScene.game = this.game;
        newScene.load = this.game.loader;
        return newScene;
    }
    createSceneFromObject(scene) {
        let newScene = new Scene(this.game);
        //  Extract callbacks
        const defaults = ['init', 'preload', 'create', 'update', 'render'];
        defaults.forEach((method) => {
            if (scene.hasOwnProperty(method)) {
                newScene[method] = scene[method];
            }
        });
        return newScene;
    }
    createSceneFromFunction(scene) {
        var newScene = new scene(this.game);
        if (newScene instanceof Scene) {
            return this.createSceneFromInstance(newScene);
        }
        else {
            return newScene;
        }
    }
}
//# sourceMappingURL=SceneManager.js.map