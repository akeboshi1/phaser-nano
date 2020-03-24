import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import RenderTexture from '../src/textures/RenderTexture';
import ImageFile from '../src/loader/files/ImageFile';
import Loader from '../src/loader/Loader';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(ImageFile(game, 'logo', 'logo.png'));
        loader.add(ImageFile(game, 'hotdog', 'hotdog.png'));
        loader.add(ImageFile(game, 'uv', 'lemming.png'));

        loader.start(() => this.create());
    }

    create ()
    {
        this.game.renderer.optimizeRedraw = false;

        const sprite1 = new Sprite(this, 400, 300, 'hotdog');
        const sprite2 = new Sprite(this, 400, 300, 'uv');

        const rt = new RenderTexture(this.game.renderer, 400, 600);

        rt.batchStart();

        for (let i: number = 0; i < 100; i++)
        {
            let x: number = Math.floor(Math.random() * 800);
            let y: number = Math.floor(Math.random() * 600);

            sprite2.setPosition(x, y);

            rt.batchDraw(sprite2);
        }

        rt.batchEnd();

        const spriteWithRT = new Sprite(this, 400, 300, rt);

        this.world.addChild(spriteWithRT, sprite1);
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
