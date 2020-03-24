import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import BitmapTextFile from '../src/loader/files/BitmapTextFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(BitmapTextFile(game, 'desyrel', 'desyrel.png', 'desyrel.xml'));

        loader.start(() => this.create());
    }

    create ()
    {
        this.game.renderer.optimizeRedraw = false;

        // const text = new Sprite(this, 300, 300, 'desyrel', 'P'.charCodeAt(0));

        // this.world.addChild(text);
    }
}

export default function ()
{
    const game = new Game({
        width: 800,
        height: 600,
        backgroundColor: 0x000033,
        parent: 'gameParent',
        scene: Demo
    });

    window['game'] = game;
}
