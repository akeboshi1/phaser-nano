export function QuadAlphaComponent(Base) {
    return class QuadAlphaComponent extends Base {
        constructor(...args) {
            super(args);
            this._alpha = 1;
            this.vertexAlpha = new Float32Array(4).fill(1);
        }
        setAlpha(topLeft = 1, topRight = topLeft, bottomLeft = topLeft, bottomRight = topLeft) {
            const alpha = this.vertexAlpha;
            alpha[0] = topLeft;
            alpha[1] = topRight;
            alpha[2] = bottomLeft;
            alpha[3] = bottomRight;
            return this.packColors();
        }
        get alpha() {
            return this._alpha;
        }
        set alpha(value) {
            this._alpha = value;
            this.setAlpha(value);
        }
    };
}
//# sourceMappingURL=QuadAlphaComponent.js.map