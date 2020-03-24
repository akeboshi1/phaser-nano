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

        const t = this.game.textures.get('desyrel');

        console.log(t);

        const P = new Sprite(this, 300, 300, 'desyrel', 'P'.charCodeAt(0));
        const H = new Sprite(this, 330, 300, 'desyrel', 'H'.charCodeAt(0));
        const A = new Sprite(this, 360, 300, 'desyrel', 'A'.charCodeAt(0));
        const S = new Sprite(this, 390, 300, 'desyrel', 'S'.charCodeAt(0));
        const E = new Sprite(this, 420, 300, 'desyrel', 'E'.charCodeAt(0));
        const R = new Sprite(this, 450, 300, 'desyrel', 'R'.charCodeAt(0));

        this.world.addChild(P, H, A, S, E, R);
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
