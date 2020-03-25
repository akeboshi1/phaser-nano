import Game from '../src/Game';
import Scene from '../src/Scene';
import Text from '../src/gameobjects/Text';
import Sprite from '../src/gameobjects/Sprite';
import Loader from '../src/loader/Loader';
import AtlasFile from '../src/loader/files/AtlasFile';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(AtlasFile(game, 'atlas', 'atlas-trimmed.png', 'atlas-trimmed.json'));

        loader.start(() => this.create());
    }

    create ()
    {
        const pic = new Sprite(this, 400, 200, 'atlas', 'hotdog');

        const text = new Text(this, 400, 300, 'Welcome to Phaser Nano');

        text.setTint(0xff0000, 0xff0000, 0xffff00, 0xffff00);

        this.world.addChild(pic, text);
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
