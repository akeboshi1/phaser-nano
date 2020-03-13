export function AlphaComponent(Base) {
    return class AlphaComponent extends Base {
        constructor() {
            super(...arguments);
            this._alpha = 1;
        }
        setAlpha(value = 1) {
            if (value !== this._alpha) {
                this._alpha = value;
                this.setDirty();
            }
            return this;
        }
        get alpha() {
            return this._alpha;
        }
        set alpha(value) {
            if (value !== this._alpha) {
                this._alpha = value;
                this.setDirty();
            }
        }
    };
}
//# sourceMappingURL=AlphaComponent.js.map