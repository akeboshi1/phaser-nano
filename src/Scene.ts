import Game from './Game';
import World from './gameobjects/World';
import ISceneConfig from './scenes/ISceneConfig';
import SceneManager from './scenes/SceneManager';

export default class Scene
{
    game: Game;
    world: World;

    constructor (game: Game, config?: string | ISceneConfig)
    {
        game.scenes.init(this, config);
    }
}
