import  Scene from '../Scene';

export default interface ISceneRunner {
    key: string;
    scene: Scene;
    active: boolean;
    visible: boolean;
    update (delta: number, now: number): void;
}
