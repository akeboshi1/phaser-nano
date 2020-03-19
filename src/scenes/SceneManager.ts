import Game from '../Game';
import Scene from '../Scene';
import World from '../gameobjects/World';
import SceneRunner from './SceneRunner';
import ISceneRunner from './ISceneRunner';
import ISceneConfig from './ISceneConfig';
import IScene from './IScene';
import GetConfigValue from './GetConfigValue';
import EventEmitter from '../core/EventEmitter';

export default class SceneManager extends EventEmitter
{
    game: Game;

    //  The Scene classes from which to create instances
    classes: Map<string, any>;

    //  The currently active scene instances
    scenes: Map<ISceneRunner, Scene>;

    //  Flush the cache
    flush: boolean = false;

    //  How many Game Objects were made dirty this frame across all Scenes?
    dirtyFrame: number = 0;

    //  How many Game Objects were processed this frame across all Scenes?
    totalFrame: number = 0;

    renderList: any[];

    sceneIndex: number = 0;

    private _tempScene: any;
    private _tempKey: string;
    private _isDuplicate: boolean = false;

    constructor (game: Game)
    {
        super();

        this.game = game;

        this.classes = new Map();
        this.scenes = new Map();

        this.renderList = [];

        this.on('init', this.init, this);
    }

    boot (scenes: any[] | IScene[])
    {
        scenes.forEach((scene) => {

            this.add(scene);

        });
    }

    init (scene: Scene, config: string | ISceneConfig = {})
    {
        const sceneIndex = this.sceneIndex;

        const sceneConfig = {
            index: sceneIndex,
            key: '',
            active: false,
            visible: false
        };

        const size = this.scenes.size;

        if (typeof config === 'string')
        {
            sceneConfig.key = config;

            if (size === 0)
            {
                //  First Scene is always active (unless specifically set otherwise)
                sceneConfig.active = true;
                sceneConfig.visible = true;
            }
        }
        else if (config || (!config && size === 0))
        {
            sceneConfig.key = GetConfigValue(config, 'key', 'scene' + sceneIndex) as string;
            sceneConfig.active = GetConfigValue(config, 'active', (size === 0)) as boolean;
            sceneConfig.visible = GetConfigValue(config, 'visible', sceneConfig.active) as boolean;
        }

        if (this._tempKey)
        {
            sceneConfig.key = this._tempKey;

            //  Test then reset
            this._tempKey = null;
        }

        if (this.keyExists(sceneConfig.key))
        {
            console.warn('Cannot add scene with duplicate key: ' + sceneConfig.key);
        }
        else
        {
            scene.game = this.game;
            scene.world = new World(scene, sceneConfig.key);
    
            if (!this._isDuplicate)
            {
                this.classes.set(sceneConfig.key, this._tempScene);

                //  Test then reset
                this._isDuplicate = false;
            }

            this.scenes.set(SceneRunner(sceneIndex, scene, sceneConfig), scene);

            this.flush = true;
    
            this.sceneIndex++;
        }

        // console.log('SceneManager.init', sceneConfig.key);
    }

    add (scene: any, newKey?: string): Scene
    {
        this._tempScene = scene;
        this._tempKey = newKey;

        // console.log('SceneManager.add', scene, newKey);

        scene = new scene(this.game);

        return scene;
    }

    update (delta: number, now: number)
    {
        for (const [ sceneRunner, scene ] of this.scenes)
        {
            if (sceneRunner.active)
            {
                sceneRunner.update(delta, now);

                scene.world.update(delta, now);
            }
        }
    }

    render (gameFrame: number): number
    {
        const renderList = this.renderList;

        renderList.length = 0;

        this.dirtyFrame = 0;
        this.totalFrame = 0;

        for (const [ sceneRunner, scene ] of this.scenes)
        {
            if (sceneRunner.visible)
            {
                let world = scene.world;

                this.dirtyFrame += world.render(gameFrame);
                this.totalFrame += world.totalFrame;
    
                renderList.push(world.camera);
                renderList.push(world.renderList);
            }
        }

        if (this.flush)
        {
            //  Break the renderer cache
            this.dirtyFrame++;

            //  And reset
            this.flush = false;
        }

        return this.dirtyFrame;
    }

    getScene (scene: string | Scene): Scene
    {
        const runner = this.getSceneRunner(scene);

        if (runner)
        {
            return runner.scene;
        }
    }

    getSceneRunner (scene: string | Scene): ISceneRunner
    {
        const key: string = this.getSceneKey(scene);

        for (const sceneRunner of this.scenes.keys())
        {
            if (sceneRunner.key === key)
            {
                return sceneRunner;
            }
        }
    }

    getSceneKey (scene: string | Scene): string
    {
        return (scene instanceof Scene) ? scene.world.name : scene;
    }

    //  Creates a brand new instance of the given Scene and starts it
    spawn (source: string, newKey: string, setActive: boolean = true): Scene
    {
        let scene = this.classes.get(source);

        if (scene)
        {
            // console.log('SceneManager.spawn', scene);

            this._isDuplicate = true;

            const newScene = this.add(scene, newKey);

            if (setActive)
            {
                this.wake(newScene);
            }

            return newScene;
        }
    }

    //  Launches an existing instance of a Scene. Scene must already be in the scenes map.
    start (scene: string | Scene, stopScene?: string | Scene)
    {
        const runner = this.getSceneRunner(scene);

        if (runner)
        {
            // console.log('SceneManager.start', runner.key, runner.index);

            this.wake(runner.scene);

            //  Boot
            runner.boot();

            this.emit('boot', runner.scene);

            // console.log(runner);

            if (stopScene)
            {
                this.stop(stopScene);
            }

            this.flush = true;
        }
    }

    stop (scene: string | Scene)
    {
        const runner = this.getSceneRunner(scene);

        if (runner)
        {
            // console.log('SceneManager.stop', runner.key, runner.index);

            this.sleep(runner.scene);

            //  Shutdown
            runner.shutdown();

            this.emit('shutdown', runner.scene);

            this.flush = true;
        }
    }

    sleep (scene: string | Scene)
    {
        this.setActive(scene, false);
        this.setVisible(scene, false);

        this.flush = true;
    }

    wake (scene: string | Scene)
    {
        this.setActive(scene);
        this.setVisible(scene);

        this.flush = true;
    }

    setActive (scene: string | Scene, active: boolean = true)
    {
        const runner = this.getSceneRunner(scene);

        if (runner)
        {
            runner.active = active;
        }
    }

    setVisible (scene: string | Scene, visible: boolean = true)
    {
        const runner = this.getSceneRunner(scene);

        if (runner)
        {
            runner.visible = visible;
        }
    }

    keyExists (scene: string | Scene): boolean
    {
        const key: string = this.getSceneKey(scene);

        for (const sceneRunner of this.scenes.keys())
        {
            if (sceneRunner.key === key)
            {
                return true;
            }
        }

        return false;
    }

    getTotal (): number
    {
        return this.scenes.size;
    }
}
