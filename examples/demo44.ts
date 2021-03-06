import Game from '../src/Game';
import Scene from '../src/Scene';
import Text from '../src/gameobjects/Text';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const text = new Text(this, 400, 300, 'Welcome to Phaser Nano');

        text.setTint(0xff0000, 0xff0000, 0xffff00, 0xffff00);

        this.world.addChild(text);
    }
}

export default function ()
{
    new Game({
        width: 800,
        height: 600,
        resolution: window.devicePixelRatio,
        backgroundColor: 0x000033,
        parent: 'gameParent',
        scene: Demo
    });
}
