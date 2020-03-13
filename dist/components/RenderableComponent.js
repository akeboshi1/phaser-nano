export function RenderableComponent(Base) {
    return class RenderableComponent extends Base {
        constructor() {
            super(...arguments);
            this.renderable = true;
        }
        setRenderable(value) {
            this.renderable = value;
            return this;
        }
        willRender() {
            return (this.visible && this.renderable && this.alpha > 0 && this.hasTexture);
        }
    };
}
//# sourceMappingURL=RenderableComponent.js.map