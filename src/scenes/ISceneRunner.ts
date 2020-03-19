import  Scene from '../Scene';

export default interface ISceneRunner {
    index: number;
    key: string;
    scene: Scene;
    active: boolean;
    visible: boolean;
    boot (): void;
    update (delta: number, now: number): void;
    shutdown (): void;
}
