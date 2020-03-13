export function ParentComponent(Base) {
    return class ParentComponent extends Base {
        constructor() {
            super(...arguments);
            this.isParent = false;
        }
        setParent(parent) {
            this.parent = parent;
            return this;
        }
        update(dt, now) {
            //  Left blank to be overridden by custom classes
        }
    };
}
//# sourceMappingURL=ParentComponent.js.map