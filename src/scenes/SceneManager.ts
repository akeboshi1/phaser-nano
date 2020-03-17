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

    //  How many Game Objects were made dirty this frame across all Scenes?
    dirtyFrame: number = 0;

    //  How many Game Objects were processed this frame across all Scenes?
    totalFrame: number = 0;

    renderList: any[];

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
        const sceneConfig = {
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
                sceneConfig.active = true;
                sceneConfig.visible = true;
            }
        }
        else if (config || (!config && size === 0))
        {
            sceneConfig.key = GetConfigValue(config, 'key', 'scene' + size.toString()) as string;
            sceneConfig.active = GetConfigValue(config, 'active', (size === 0)) as boolean;
            sceneConfig.visible = GetConfigValue(config, 'visible', sceneConfig.active) as boolean;
        }

        

        scene.game = this.game;
        scene.world = new World(scene, sceneConfig.key);

        this.classes.set(sceneConfig.key, this._tempScene);
        this.scenes.set(SceneRunner(scene, sceneConfig), scene);

        console.log('SceneManager.init', sceneConfig.key);
    }

    add (scene: any)
    {
        // this._tempScene = scene;

        console.log('SceneManager.add', scene);

        scene = new scene(this.game);



        return scene;
    }

    update (delta: number, now: number)
    {
        for (const [ sceneRunner, scene ] of this.scenes)
        {
            if (!sceneRunner.active)
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

        return this.dirtyFrame;
    }

    getSceneKey (scene: string | Scene): string
    {
        return (scene instanceof Scene) ? scene.world.name : scene;
    }

    start ()
    {
        //  Stop the calling scene and start the new one
    }

    stop ()
    {
        //  Stop the calling scene
    }

    duplicate (source: string, newKey: string)
    {
        let scene = this.classes.get(source);

        if (scene)
        {
            this._tempScene = scene;

            console.log('SceneManager.duplicate', scene);
    
            scene = new scene(this.game, newKey);
        }
    }

    /*
    launch (scene: string | Scene, newKey: string = '')
    {
        console.log('SceneManager.launch', scene);

        if (typeof scene === 'string')
        {
            scene = this.classes.get(scene);

            if (!scene)
            {
                return;
            }
            else
            {

            }
        }
        else
        {
            this.add(scene);
        }

        this.setActive(scene);
        this.setVisible(scene);
    }
    */

    sleep (scene: string | Scene)
    {
        this.setActive(scene, false);
        this.setVisible(scene, false);
    }

    wake ()
    {

    }

    setActive (scene: string | Scene, active: boolean = true)
    {
        const key: string = this.getSceneKey(scene);

        for (const sceneRunner of this.scenes.keys())
        {
            if (sceneRunner.key === key)
            {
                sceneRunner.active = active;
            }
        }
    }

    setVisible (scene: string | Scene, visible: boolean = true)
    {
        const key: string = this.getSceneKey(scene);

        for (const sceneRunner of this.scenes.keys())
        {
            if (sceneRunner.key === key)
            {
                sceneRunner.visible = visible;
            }
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
