import Game from './Game';
import World from './gameobjects/World';
import ISceneConfig from './scenes/ISceneConfig';

export default class Scene
{
    game: Game;
    world: World;

    constructor (game: Game, config?: string | ISceneConfig)
    {
        this.game = game;

        game.scenes.init(this, config);
    }
}
