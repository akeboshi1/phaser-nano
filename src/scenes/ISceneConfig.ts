import Game from '../Game';
import World from '../gameobjects/World';

export default interface ISceneConfig
{
    game?: Game;
    key?: string;
    active?: boolean;
    visible?: boolean;
}
