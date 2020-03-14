import Game from '../Game';
import Scene from '../Scene';
import IScene from './IScene';

export default class SceneManager
{
    game: Game;
    scenes: Map<string, Scene>;

    //  How many Game Objects were made dirty this frame across all Scenes?
    dirtyFrame: number = 0;

    //  How many Game Objects were processed this frame across all Scenes?
    totalFrame: number = 0;

    renderList: any[];

    constructor (game: Game, sceneConfig)
    {
        this.game = game;

        this.scenes = new Map();

        this.renderList = [];

        sceneConfig = [].concat(sceneConfig);

        sceneConfig.forEach((scene) => {
            this.addScene(scene);
        })
    }

    update (delta: number, now: number)
    {
        this.scenes.forEach(scene => {

            // scene.update(dt, now);
            scene.world.update(delta, now);

        });
    }

    render (gameFrame: number): number
    {
        const renderList = this.renderList;

        renderList.length = 0;

        this.dirtyFrame = 0;
        this.totalFrame = 0;

        this.scenes.forEach(scene => {

            let world = scene.world;

            this.dirtyFrame += world.render(gameFrame);
            this.totalFrame += world.totalFrame;

            renderList.push(world.camera);
            renderList.push(world.renderList);

        });

        return this.dirtyFrame;
    }

    addScene (sceneConfig: IScene | Scene)
    {
        let scene: Scene;

        if (sceneConfig instanceof Scene)
        {
            scene = this.createSceneFromInstance(sceneConfig);
        }
        else if (typeof sceneConfig === 'object')
        {
            scene = this.createSceneFromObject(sceneConfig);
        }
        else if (typeof sceneConfig === 'function')
        {
            scene = this.createSceneFromFunction(sceneConfig);
        }

        console.log('Scene.addScene', scene.world.name);

        this.scenes.set(scene.world.name, scene);
    }

    createSceneFromInstance (newScene: Scene): Scene
    {
        newScene.game = this.game;

        return newScene;
    }

    createSceneFromObject (scene: any): Scene
    {
        let newScene = new Scene(this.game);

        //  Extract callbacks

        const defaults = [ 'init', 'preload', 'create', 'update', 'render' ];

        defaults.forEach((method) => {

            if (scene.hasOwnProperty(method))
            {
                newScene[method] = scene[method];
            }

        });

        return newScene;
    }

    createSceneFromFunction (scene: any): Scene
    {
        var newScene = new scene(this.game);

        if (newScene instanceof Scene)
        {
            return this.createSceneFromInstance(newScene);
        }
        else
        {
            return newScene;
        }
    }
}
