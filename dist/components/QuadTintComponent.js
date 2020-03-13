export function QuadTintComponent(Base) {
    return class QuadTintComponent extends Base {
        constructor(...args) {
            super(args);
            this._tint = 0xffffff;
            this.vertexTint = new Uint32Array(4).fill(0xffffff);
        }
        setTint(topLeft = 0xffffff, topRight = topLeft, bottomLeft = topLeft, bottomRight = topLeft) {
            const tint = this.vertexTint;
            tint[0] = topLeft;
            tint[1] = topRight;
            tint[2] = bottomLeft;
            tint[3] = bottomRight;
            return this.packColors();
        }
        get tint() {
            return this._tint;
        }
        set tint(value) {
            this._tint = value;
            this.setTint(value);
        }
    };
}
//# sourceMappingURL=QuadTintComponent.js.map