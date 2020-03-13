import Scene from '../Scene';
import Container from './Container';
export default class World extends Container {
    renderList: any[];
    constructor(scene: Scene);
    private scanChildren;
    private buildRenderList;
    preRender(): any[];
    update(dt: number, now: number): void;
}
//# sourceMappingURL=World.d.ts.map