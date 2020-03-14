import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import ImageFile from '../src/loader/ImageFile';
import GridTexture from '../src/textures/GridTexture';
import SolidColorTexture from '../src/textures/SolidColorTexture';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        // const red = SolidColorTexture('#ff0000', 256, 256);
        // this.game.textures.add('red', red);
        // this.world.addChild(new Sprite(this, 400, 300, 'red'));

        const grid = GridTexture('#ff0000', '#00ff00', 256, 256, 8, 8);
        this.game.textures.add('grid', grid);
        this.world.addChild(new Sprite(this, 400, 300, 'grid'));
    }
}

class Demo2 extends Scene
{
    constructor (game: Game)
    {
        super(game, 'Bob');

        ImageFile(game, 'logo', 'assets/logo.png').then(() => {

            this.world.addChild(new Sprite(this, 400, 300, 'logo'));

        });
    }
}

export default function ()
{
    new Game({
        width: 800,
        height: 600,
        backgroundColor: 0x000033,
        parent: 'gameParent',
        scene: [ Demo, Demo2 ]
    });
}
