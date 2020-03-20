import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import AtlasFile from '../src/loader/files/AtlasFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    dx: number = 1;

    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        // loader.add(AtlasFile(game, 'test', 'atlas-notrim.png', 'atlas-notrim.json'));
        loader.add(AtlasFile(game, 'test', 'atlas-trimmed.png', 'atlas-trimmed.json'));

        loader.start(() => this.create());
    }

    create ()
    {
        const sprite1 = new Sprite(this, 400, 300, 'test', 'ayu');
        const sprite2 = new Sprite(this, 400, 300, 'test', 'hello');
        const sprite3 = new Sprite(this, 400, 50, 'test', 'brain');

        this.world.addChild(sprite1, sprite2, sprite3);

        window['scene'] = this;
    }

    update ()
    {
        this.world.camera.x += this.dx;

        if (this.world.camera.x < -300 || this.world.camera.x > 300)
        {
            this.dx *= -1;
        }
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
}
