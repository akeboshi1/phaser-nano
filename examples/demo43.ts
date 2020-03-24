import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import RenderTexture from '../src/textures/RenderTexture';
import AtlasFile from '../src/loader/files/AtlasFile';
import Loader from '../src/loader/Loader';
import Mouse from '../src/input/Mouse';

class Demo extends Scene
{
    rt: RenderTexture;

    constructor (game: Game)
    {
        super(game);

        game.scenes.setActive(this, false);

        const loader = new Loader(game);

        loader.setPath('assets');

        loader.add(AtlasFile(game, 'atlas', 'atlas-trimmed.png', 'atlas-trimmed.json'));

        loader.start(() => this.create());
    }

    create ()
    {
        const mouse = new Mouse(this.game.renderer.canvas);

        this.game.renderer.optimizeRedraw = false;

        const brush = new Sprite(this, 0, 0, 'atlas', 'hotdog');
        const rendertexture = new RenderTexture(this.game.renderer, 800, 600);
        const spriteWithRT = new Sprite(this, 400, 300, rendertexture);

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

        this.rt = rendertexture;

        this.world.addChild(spriteWithRT);

        this.game.scenes.setActive(this);
    }

    update ()
    {
        // this.rt.fill(0, 0, 0, 0.00001);
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
