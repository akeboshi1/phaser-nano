import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import ImageFile from '../src/loader/files/ImageFile';
import Loader from '../src/loader/Loader';
import Mouse from '../src/input/Mouse';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(
            ImageFile(game, '128x128'),
            ImageFile(game, '512x512')
        );

        loader.start(() => this.create());
    }

    create ()
    {
        const mouse = new Mouse(this.game.renderer.canvas);

        const sprite1 = new Sprite(this, 400, 300, '128x128');

        sprite1.setInteractive();

        this.world.addChild(sprite1);

        mouse.on('pointerdown', (x: number, y: number) => {

            if (mouse.hitTest(sprite1))
            {
                console.log('hit!');
            }
            else
            {
                console.log('miss!');
            }

        });
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
