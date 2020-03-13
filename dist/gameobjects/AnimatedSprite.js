import Sprite from './Sprite';
import * as Components from '../components';
import Install from '../components/Install';
export default class AnimatedSprite extends Install(Sprite, [
    Components.AnimationComponent
]) {
    constructor(scene, x, y, texture, frame) {
        super();
        this.setScene(scene);
        this.setTexture(texture, frame);
        this.setPosition(x, y);
    }
}
//# sourceMappingURL=AnimatedSprite.js.map