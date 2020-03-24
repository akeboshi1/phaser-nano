import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import RenderTexture from '../src/textures/RenderTexture';
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

        loader.add(ImageFile(game, 'lemming', 'lemming.png'));

        loader.start(() => this.create());
    }

    create ()
    {
        const mouse = new Mouse(this.game.renderer.canvas);

        this.game.renderer.optimizeRedraw = false;

        const brush = new Sprite(this, 0, 0, 'lemming');
        const rendertexture = new RenderTexture(this.game.renderer, 800, 600);
        const spriteWithRT = new Sprite(this, 400, 300, 'drawingPad');

        const paint = (x: number, y: number) => {

            if (mouse.primaryDown)
            {
                brush.setPosition(x, y);
                brush.rotation += 0.01;
                rendertexture.draw(brush);
            }

        };

        mouse.on('pointerdown', paint);
        mouse.on('pointermove', paint);

        this.world.addChild(spriteWithRT);
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
