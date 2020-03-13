import Vec2 from '../math/Vec2';
export function SkewComponent(Base) {
    return class SkewComponent extends Base {
        constructor() {
            super(...arguments);
            this._skew = new Vec2(0, 0);
        }
        setSkew(skewX, skewY = skewX) {
            this._skew.set(skewX, skewY);
            return this.updateCache();
        }
        set skewX(value) {
            if (value !== this._skew.x) {
                this._skew.x = value;
                this.updateCache();
            }
        }
        get skewX() {
            return this._skew.x;
        }
        set skewY(value) {
            if (value !== this._skew.y) {
                this._skew.y = value;
                this.updateCache();
            }
        }
        get skewY() {
            return this._skew.y;
        }
    };
}
//# sourceMappingURL=SkewComponent.js.map