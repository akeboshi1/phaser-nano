import Scene from '../Scene';
import ISceneRunner from './ISceneRunner';
import NOOP from '../core/NOOP';
import ISceneConfig from './ISceneConfig';
import GetConfigValue from './GetConfigValue';

export default function SceneRunner (index: number, scene: Scene, config: ISceneConfig): ISceneRunner
{
    return {
        index,
        key: scene.world.name,
        scene,
        active: config.active,
        visible: config.visible,
        boot: GetConfigValue(scene, 'boot', NOOP),
        update: GetConfigValue(scene, 'update', NOOP),
        shutdown: GetConfigValue(scene, 'shutdown', NOOP)
    }
}
