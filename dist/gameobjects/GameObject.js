import Install from '../components/Install';
import * as Components from '../components';
export default class GameObject extends Install(class {
}, [
    Components.AlphaComponent,
    Components.DirtyComponent,
    Components.ParentComponent,
    Components.OriginComponent,
    Components.PositionComponent,
    Components.RenderableComponent,
    Components.RotationComponent,
    Components.ScaleComponent,
    Components.SceneComponent,
    Components.SizeComponent,
    Components.SkewComponent,
    Components.TransformComponent,
    Components.VisibleComponent
]) {
    constructor(scene, x = 0, y = 0) {
        super();
        this.scene = scene;
        this._position.set(x, y);
        this.dirty = true;
    }
}
;
//# sourceMappingURL=GameObject.js.map