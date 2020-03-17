import Game from '../Game';

export default interface ISceneConfig
{
    game?: Game;
    key?: string;
    active?: boolean;
    visible?: boolean;
}
