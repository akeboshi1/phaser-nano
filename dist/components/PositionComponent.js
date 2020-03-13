import Vec2 from '../math/Vec2';
export function PositionComponent(Base) {
    return class PositionComponent extends Base {
        constructor() {
            super(...arguments);
            this._position = new Vec2();
        }
        setPosition(x, y = x) {
            this._position.set(x, y);
            return this.updateTransform();
        }
        set x(value) {
            this._position.x = value;
            this.updateTransform();
        }
        get x() {
            return this._position.x;
        }
        set y(value) {
            this._position.y = value;
            this.updateTransform();
        }
        get y() {
            return this._position.y;
        }
    };
}
//# sourceMappingURL=PositionComponent.js.map