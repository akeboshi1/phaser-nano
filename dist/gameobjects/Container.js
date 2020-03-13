import GameObject from './GameObject';
import * as Components from '../components';
import Install from '../components/Install';
export default class Container extends Install(GameObject, [
    Components.ContainerComponent
]) {
    constructor(scene, x = 0, y = 0) {
        super();
        this.setScene(scene);
        this.setPosition(x, y);
    }
    update(dt, now) {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            children[i].update(dt, now);
        }
    }
    preRender(dt, now) {
        const game = this.scene.game;
        game.totalFrame++;
        if (this.dirtyFrame >= game.frame) {
            game.dirtyFrame++;
        }
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            // children[i].preRender(dt, now);
        }
    }
    updateTransform() {
        super.updateTransform();
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            children[i].updateTransform();
        }
        return this;
    }
}
//# sourceMappingURL=Container.js.map