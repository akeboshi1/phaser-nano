import Game from '../src/Game';
import Scene from '../src/Scene';
import Sprite from '../src/gameobjects/Sprite';
import ImageFile from '../src/loader/ImageFile';
import GridTexture from '../src/textures/GridTexture';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game, 'gridScene');

        if (!this.game.textures.has('grid'))
        {
            this.game.textures.add('grid', GridTexture('#ff0000', '#00ff00', 64, 64, 4, 4));
        }

        const x = Math.random() * 800;
        const y = Math.random() * 600;

        this.world.addChild(new Sprite(this, x, y, 'grid'));
    }
}

class Demo2 extends Scene
{
    constructor (game: Game)
    {
        super(game, 'image');

        ImageFile(game, 'logo', 'assets/logo.png').then(() => {

            this.world.addChild(new Sprite(this, 400, 300, 'logo'));

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
        scene: [ Demo, Demo2 ]
    });

    let i = 0;

    window.addEventListener('click', () => {

        console.log('click');

        game.scenes.duplicate('gridScene', 'gridScene' + i);

        i++;

    });
}
