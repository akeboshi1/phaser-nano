import Scene from '../Scene';
import Container from './Container';
import { IContainerComponent } from '../components/ContainerComponent';
import IContainerChild from './IContainerChild';
import Camera from './Camera';

export default class World extends Container
{
    //  How many Game Objects were made dirty this frame?
    dirtyFrame: number = 0;

    //  How many Game Objects were processed this frame?
    totalFrame: number = 0;

    //  A list of Game Objects that will be rendered in the next pass
    renderList: IContainerChild[];

    camera: Camera;

    constructor (scene: Scene, key: string)
    {
        super(scene);

        this.name = key;

        this.renderList = [];

        this.camera = new Camera(scene, 0, 0);
    }

    private scanChildren (root: IContainerComponent, gameFrame: number)
    {
        const children = root.getChildren();

        for (let i: number = 0; i < children.length; i++)
        {
            this.buildRenderList(children[i], gameFrame);
        }
    }

    private buildRenderList (root: IContainerChild, gameFrame: number)
    {
        if (root.willRender())
        {
            this.renderList.push(root);

            if (root.dirtyFrame >= gameFrame)
            {
                this.dirtyFrame++;
            }
        }

        if (root.isParent)
        {
            this.scanChildren(root as unknown as IContainerComponent, gameFrame);
        }
    }

    update (dt: number, now: number)
    {
        const children = this.children;

        for (let i: number = 0; i < children.length; i++)
        {
            children[i].update(dt, now);
        }
    }

    render (gameFrame: number): number
    {
        this.dirtyFrame = 0;
        this.renderList.length = 0;

        this.scanChildren(this, gameFrame);

        this.totalFrame = this.renderList.length;

        return this.dirtyFrame;
    }
}
