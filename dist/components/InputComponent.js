export function InputComponent(Base) {
    return class InputComponent extends Base {
        constructor() {
            super(...arguments);
            this.inputEnabled = false;
            this.inputEnabledChildren = true;
        }
        setInteractive(hitArea) {
            this.inputEnabled = true;
            this.inputHitArea = hitArea;
            this.inputEnabledChildren = true;
            return this;
        }
    };
}
//# sourceMappingURL=InputComponent.js.map