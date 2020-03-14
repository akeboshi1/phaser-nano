import Game from './Game';
import World from './gameobjects/World';

export default class Scene
{
    game: Game;
    world: World;

    constructor (game: Game, key: string = 'default')
    {
        this.game = game;
        this.world = new World(this, key);
    }
}
