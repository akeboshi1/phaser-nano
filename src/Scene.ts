import Game from './Game';
import World from './gameobjects/World';
import ISceneConfig from './scenes/ISceneConfig';
import SceneManager from './scenes/SceneManager';

export default class Scene
{
    game: Game;
    world: World;

    constructor (sceneManager: SceneManager, config?: string | ISceneConfig)
    {
        sceneManager.init(this, config);
    }
}
