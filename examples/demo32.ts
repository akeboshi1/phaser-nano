import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import ImageFile from '../src/loader/ImageFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        // loader.add(ImageFile(game, 'star', 'star.png'));
        // loader.add(ImageFile(game, 'clown', 'clown.png'));
        // loader.add(ImageFile(game, 'logo', 'logo.png'));

        loader.add(
            ImageFile(game, 'star', 'star.png'),
            ImageFile(game, 'clown', 'clown.png'),
            ImageFile(game, 'logo', 'logo.png')
        );

        loader.start(() => this.create());
    }

    create ()
    {
        const sprite1 = new Sprite(this, 400, 300, 'logo');
        const sprite2 = new Sprite(this, 400, 300, 'star');
        const sprite3 = new Sprite(this, 400, 50, 'clown');

        this.game.scenes.flush = true;

        this.world.addChild(sprite1, sprite2, sprite3);
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
