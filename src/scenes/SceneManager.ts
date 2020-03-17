import Game from '../Game';
import Scene from '../Scene';
import World from '../gameobjects/World';
import SceneRunner from './SceneRunner';
import ISceneRunner from './ISceneRunner';
import ISceneConfig from './ISceneConfig';
import IScene from './IScene';
import GetConfigValue from './GetConfigValue';

export default class SceneManager
{
    game: Game;

    //  The currently active scene instances
    scenes: Map<ISceneRunner, Scene>;

    //  How many Game Objects were made dirty this frame across all Scenes?
    dirtyFrame: number = 0;

    //  How many Game Objects were processed this frame across all Scenes?
    totalFrame: number = 0;

    renderList: any[];

    constructor (game: Game)
    {
        this.game = game;

        this.scenes = new Map();

        this.renderList = [];
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

        this.scenes.set(SceneRunner(scene, sceneConfig), scene);
    }

    add (scene: any)
    {
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

    launch (scene: string | Scene)
    {
        //  Needs to create an instance of the scene

        this.setActive(scene);
        this.setVisible(scene);
    }

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
}
