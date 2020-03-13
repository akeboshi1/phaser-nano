import Vec2 from '../math/Vec2';
export function OriginComponent(Base) {
    return class OriginComponent extends Base {
        constructor() {
            super(...arguments);
            this._origin = new Vec2(0.5, 0.5);
        }
        setOrigin(originX, originY = originX) {
            this._origin.set(originX, originY);
            return this;
        }
        get originX() {
            return this._origin.x;
        }
        set originX(value) {
            this._origin.x = value;
        }
        get originY() {
            return this._origin.y;
        }
        set originY(value) {
            this._origin.y = value;
        }
    };
}
//# sourceMappingURL=OriginComponent.js.map