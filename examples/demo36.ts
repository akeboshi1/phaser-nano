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

        // new Stats(game, 'base');

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(
            ImageFile(game, '512', '512x512.png'),
            ImageFile(game, '256', 'f-texture.png'),
            ImageFile(game, '128', '128x128.png'),
            ImageFile(game, '64', 'box-item-boxed.png'),
            ImageFile(game, '32', '32x32.png')
        );

        loader.start(() => this.create());
    }

    create ()
    {
        const mouse = new Mouse(this.game.renderer.canvas);

        const parent1 = new Sprite(this, 400, 300, '512');
        const parent2 = new Sprite(this, 0, 0, '256');
        const parent3 = new Sprite(this, 0, 0, '128');
        const parent4 = new Sprite(this, 0, 0, '64');
        const child = new Sprite(this, 0, 0, '32');

        child.setInteractive();

        parent1.addChild(parent2);
        parent2.addChild(parent3);
        parent3.addChild(parent4);
        parent4.addChild(child);

        this.world.addChild(parent1);

        mouse.on('pointerdown', (x: number, y: number) => {

            const results = mouse.hitTestChildren(parent1);

            console.log(
                (results.length > 0) ? 'Hit!' : 'None'
            );

        });
    }
}

export default function ()
{
    let game = new Game({
        width: 800,
        height: 600,
        backgroundColor: 0x000033,
        parent: 'gameParent',
        scene: Demo
    });
}
