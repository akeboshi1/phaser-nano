import { IDirtyComponent } from './DirtyComponent';
import IContainerChild from '../gameobjects/IContainerChild';

type Constructor<T = {}> = new (...args: any[]) => T;
type Transformable = Constructor<IDirtyComponent & IContainerChild>

export function TransformBypassComponent<TBase extends Transformable>(Base: TBase)
{
    return class TransformComponent extends Base
    {
        constructor (...args: any[])
        {
            super(args);
        }

        updateTransform ()
        {
            return this;
        }
    };
}

export interface ITransformBypassComponent
{
    updateTransform (): this;
}
