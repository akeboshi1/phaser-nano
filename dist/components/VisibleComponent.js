export function VisibleComponent(Base) {
    return class VisibleComponent extends Base {
        constructor() {
            super(...arguments);
            this.visible = true;
        }
        setVisible(value) {
            this.visible = value;
            return this;
        }
    };
}
//# sourceMappingURL=VisibleComponent.js.map