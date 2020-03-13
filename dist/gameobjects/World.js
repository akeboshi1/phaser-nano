import Container from './Container';
export default class World extends Container {
    constructor(scene) {
        super(scene);
        this.renderList = [];
    }
    scanChildren(root) {
        const children = root.getChildren();
        for (let i = 0; i < children.length; i++) {
            this.buildRenderList(children[i]);
        }
    }
    buildRenderList(root) {
        const game = this.scene.game;
        if (root.willRender()) {
            this.renderList.push(root);
            if (root.dirtyFrame >= game.frame) {
                game.dirtyFrame++;
            }
        }
        if (root.isParent) {
            this.scanChildren(root);
        }
    }
    preRender() {
        this.renderList = [];
        this.scanChildren(this);
        return this.renderList;
    }
    update(dt, now) {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            children[i].update(dt, now);
        }
    }
}
//# sourceMappingURL=World.js.map