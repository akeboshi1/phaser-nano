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
            ImageFile(game, '32x32'),
            ImageFile(game, '128x128'),
            ImageFile(game, '512x512'),
            ImageFile(game, 'ayu'),
            ImageFile(game, 'balls'),
            ImageFile(game, 'beball1'),
            ImageFile(game, 'box-item-boxed'),
            ImageFile(game, 'brain'),
            ImageFile(game, 'bubble256'),
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
        );

        loader.on('progress', (progress, totalCompleted, totalQueued) => {

            console.log(progress, ' - (' + totalCompleted + ' / ' + totalQueued + ')');

        });

        loader.start(() => this.create());
    }

    create ()
    {
        this.game.renderer.optimizeRedraw = false;

        this.game.textures.textures.forEach((texture, key) => {

            let x: number = 50 + Math.floor(Math.random() * 700);
            let y: number = 50 + Math.floor(Math.random() * 500);

            let s = new Sprite(this, x, y, key);

            this.world.addChild(s);

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
