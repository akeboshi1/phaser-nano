export function RotationComponent(Base) {
    return class RotationComponent extends Base {
        constructor() {
            super(...arguments);
            this._rotation = 0;
        }
        setRotation(rotation) {
            if (rotation !== this._rotation) {
                this._rotation = rotation;
                this.updateCache();
            }
            return this;
        }
        set rotation(value) {
            if (value !== this._rotation) {
                this._rotation = value;
                this.updateCache();
            }
        }
        get rotation() {
            return this._rotation;
        }
    };
}
//# sourceMappingURL=RotationComponent.js.map