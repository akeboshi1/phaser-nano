import Scene from '../Scene';
import ISceneRunner from './ISceneRunner';
import NOOP from '../core/NOOP';

export default function SceneRunner (scene: Scene, active: boolean, visible: boolean): ISceneRunner
{
    return {
        key: scene.world.name,
        scene,
        active,
        visible,
        update: (scene.hasOwnProperty('update')) ? scene['update'] : NOOP
    }
}
