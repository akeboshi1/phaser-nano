import Game from '../Game';
import Scene from '../Scene';
import IScene from './IScene';
export default class SceneManager {
    game: Game;
    scenes: Map<string, Scene>;
    constructor(game: Game, sceneConfig: any);
    update(delta: number, now: number): void;
    render(): void;
    addScene(sceneConfig: IScene | Scene): void;
    createSceneFromInstance(newScene: Scene): Scene;
    createSceneFromObject(scene: any): Scene;
    createSceneFromFunction(scene: any): Scene;
}
//# sourceMappingURL=SceneManager.d.ts.map