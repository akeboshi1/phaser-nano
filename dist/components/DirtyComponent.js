export function DirtyComponent(Base) {
    return class DirtyComponent extends Base {
        constructor() {
            super(...arguments);
            this.dirty = true;
            this.dirtyFrame = 0;
        }
        setDirty(setFrame = true) {
            this.dirty = true;
            if (setFrame) {
                this.dirtyFrame = this.scene.game.frame;
            }
            return this;
        }
    };
}
//# sourceMappingURL=DirtyComponent.js.map