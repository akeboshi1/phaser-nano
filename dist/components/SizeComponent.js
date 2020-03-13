export function SizeComponent(Base) {
    return class SizeComponent extends Base {
        setSize(width, height) {
            this.width = width;
            this.height = height;
            return this;
        }
    };
}
//# sourceMappingURL=SizeComponent.js.map