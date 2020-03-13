import Vec2 from '../math/Vec2';
export function ScaleComponent(Base) {
    return class ScaleComponent extends Base {
        constructor() {
            super(...arguments);
            this._scale = new Vec2(1, 1);
        }
        setScale(scaleX, scaleY = scaleX) {
            this._scale.set(scaleX, scaleY);
            return this.updateCache();
        }
        set scaleX(value) {
            if (value !== this._scale.x) {
                this._scale.x = value;
                this.updateCache();
            }
        }
        get scaleX() {
            return this._scale.x;
        }
        set scaleY(value) {
            if (value !== this._scale.y) {
                this._scale.y = value;
                this.updateCache();
            }
        }
        get scaleY() {
            return this._scale.y;
        }
    };
}
//# sourceMappingURL=ScaleComponent.js.map