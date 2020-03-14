import Scene from '../Scene';
import GameObject from './GameObject';
import * as Components from '../components';
import Install from '../components/Install';
import IContainer from './IContainer';

export default class Container extends Install(GameObject, [
    Components.ContainerComponent
])
{
    constructor (scene: Scene, x: number = 0, y: number = 0)
    {
        super();

        this.setScene(scene);
        this.setPosition(x, y);
    }

    update (dt: number, now: number)
    {
        const children = this.children;

        for (let i = 0; i < children.length; i++)
        {
            children[i].update(dt, now);
        }
    }

    updateTransform ()
    {
        super.updateTransform();
   
        const children = this.children;

        for (let i: number = 0; i < children.length; i++)
        {
            children[i].updateTransform();
        }

        return this;
    }
}

export default interface Container extends IContainer {}
