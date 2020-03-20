import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import ImageFile from '../src/loader/files/ImageFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(
            ImageFile(game, '1x1'),
            ImageFile(game, '2x2'),
            ImageFile(game, '4x4'),
            ImageFile(game, '8x8'),
            ImageFile(game, '32x32'),
            ImageFile(game, '128x128'),
            ImageFile(game, '512x512'),
            ImageFile(game, 'ayu'),
            ImageFile(game, 'balls'),
            ImageFile(game, 'beball1'),
            ImageFile(game, 'box-item-boxed'),
            ImageFile(game, 'brain'),
            ImageFile(game, 'bubble256'),
            ImageFile(game, 'bubbles-background'),
            ImageFile(game, 'car'),
            ImageFile(game, 'carrot'),
            ImageFile(game, 'checker'),
            ImageFile(game, 'clown'),
            ImageFile(game, 'hotdog'),
            ImageFile(game, 'lance-overdose-loader-eye'),
            ImageFile(game, 'lemming'),
            ImageFile(game, 'logo'),
            ImageFile(game, 'mushroom-32x32'),
            ImageFile(game, 'muzzleflash2'),
            ImageFile(game, 'orange-cat1'),
            ImageFile(game, 'orb-blue'),
            ImageFile(game, 'orb-red'),
            ImageFile(game, 'pacman_by_oz_28x28'),
            ImageFile(game, 'phaser-ship'),
            ImageFile(game, 'phaser_tiny'),
            ImageFile(game, 'red'),
            ImageFile(game, 'rocket'),
            ImageFile(game, 'shinyball'),
            ImageFile(game, 'skull'),
            ImageFile(game, 'sonic'),
            ImageFile(game, 'star'),
            ImageFile(game, 'terrain2'),
            ImageFile(game, 'uv-grid-diag')
        );

        loader.setMaxParallelDownloads(1);

        loader.on('progress', (progress, totalCompleted, totalQueued) => {

            console.log(progress, ' - (' + totalCompleted + ' / ' + totalQueued + ')');

        });

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
