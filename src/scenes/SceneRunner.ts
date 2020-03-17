import Scene from '../Scene';
import ISceneRunner from './ISceneRunner';
import NOOP from '../core/NOOP';
import ISceneConfig from './ISceneConfig';
import GetConfigValue from './GetConfigValue';

export default function SceneRunner (scene: Scene, config: ISceneConfig): ISceneRunner
{
    return {
        key: scene.world.name,
        scene,
        active: config.active,
        visible: config.visible,
        update: GetConfigValue(scene, 'update', NOOP)
    }
}
