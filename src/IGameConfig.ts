import IScene from './scenes/IScene';

export default interface IGameConfig {
    width?: number;
    height?: number;
    resolution?: number;
    parent?: string | HTMLElement;
    backgroundColor?: number;
    scene?: IScene | IScene[] | any | any[];
}
