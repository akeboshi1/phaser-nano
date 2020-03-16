import Game from '../Game';
import Scene from '../Scene';
import World from '../gameobjects/World';
import SceneRunner from './SceneRunner';
import ISceneRunner from './ISceneRunner';
import ISceneConfig from './ISceneConfig';

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

    constructor (game: Game, scenes: [])
    {
        this.game = game;

        this.scenes = new Map();

        this.renderList = [];

        scenes.forEach((scene, index) => {

            //  The first scene in the array is always active, the rest asleep
            // let active: boolean = (index === 0) ? true : false;
            // this.add(scene, active, active);

        });
    }

    init (scene: Scene, config?: string | ISceneConfig)
    {
        const sceneConfig = {
            key: 'default',
            active: false,
            visible: false
        };

        if (typeof config === 'string')
        {
            sceneConfig.key = config;
        }
        else if (config)
        {
            if (config.hasOwnProperty('key'))
            {
                sceneConfig.key = config.key;
            }

            if (config.hasOwnProperty('active'))
            {
                sceneConfig.active = config.active;
            }

            if (config.hasOwnProperty('visible'))
            {
                sceneConfig.visible = config.visible;
            }
        }

        scene.game = this.game;
        scene.world = new World(scene, config.key);

        // this.setActive(scene, config.active);
        // this.setVisible(scene, config.visible);
    }

    add (scene: any, active: boolean = false, visible: boolean = false)
    {
        //  Create an instance of the Scene using the default config

        scene = new scene(this, {
            key: 'default',
            active,
            visible
        });

        console.log('Scene.addScene', scene.world.name);

        this.scenes.set(SceneRunner(scene, active, visible), scene);

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

    OLDadd (scene: any | Scene, active: boolean = false, visible: boolean = false): Scene
    {
        const game = this.game;

        if (typeof scene === 'object')
        {
            scene = new scene(game);
        }
        else
        {
            scene.game = game;
        }

        console.log('Scene.addScene', scene.world.name);

        //  Store the scene constructor somewhere?

        this.scenes.set(SceneRunner(scene, active, visible), scene);

        return scene;
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
