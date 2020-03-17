import Game from './Game';
import World from './gameobjects/World';
import ISceneConfig from './scenes/ISceneConfig';
import GetConfigValue from './scenes/GetConfigValue';

export default class Scene
{
    game: Game;
    world: World;

    constructor (game: Game, config?: string | ISceneConfig)
    {
        this.game = game;

        const key = game.scenes.init(this, config);
    }
}
