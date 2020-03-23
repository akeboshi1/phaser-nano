import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import SpriteBuffer from '../src/gameobjects/SpriteBuffer';
import ImageFile from '../src/loader/files/ImageFile';
import SpriteSheetFile from '../src/loader/files/SpriteSheetFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    cx: number = 0;
    ccx: number = 0;
    ccy: number = 0;

    constructor (game: Game)
    {
        super(game);

        // new Stats(game, 'base');

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(
            SpriteSheetFile(game, 'pacman', 'pacman_by_oz_28x28.png', { frameWidth: 28 }),
            ImageFile(game, '128', '128x128.png')
        );

        loader.start(() => this.create());
    }

    create ()
    {
        const pacman = new Sprite(this, 400, 300, 'pacman', 0);

        const buffer = new SpriteBuffer(this, 65535);

        for (let i: number = 0; i < buffer.maxSize; i++)
        {
            let x: number = -1600 + Math.floor(Math.random() * 3200);
            let y: number = -1200 + Math.floor(Math.random() * 2400);
            let f: number = Math.floor(Math.random() * 11);

            pacman.setPosition(x, y);
            pacman.setFrame(f);

            buffer.add(pacman);
        }

        this.world.addChild(buffer);
    }

    update (delta: number)
    {
        this.ccx = Math.sin(this.cx) * 800;
        this.ccy = Math.cos(this.cx) * 800;

        this.world.camera.x = Math.floor(this.ccx);
        this.world.camera.y = Math.floor(this.ccy);

        this.cx += delta / 2;
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
