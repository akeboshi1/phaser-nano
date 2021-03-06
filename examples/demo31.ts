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
    star: Sprite;

    constructor (game: Game)
    {
        super(game, { key: 'image', active: false });

        if (!this.game.textures.has('star'))
        {
            ImageFile(game, 'star', 'assets/star.png').then(() => this.addStar());
        }
        else
        {
            this.addStar();
        }
    }

    addStar ()
    {
        const x = Math.random() * 800;
        const y = Math.random() * 600;

        this.star = new Sprite(this, x, y, 'star');

        this.world.addChild(this.star);

        this.game.scenes.wake(this);
    }

    update ()
    {
        this.star.rotation += 0.01;
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

    window['game'] = game;

    let i = 0;

    window.addEventListener('click', () => {

        // game.scenes.start('image', 'gridScene');
        // game.scenes.spawn('gridScene', 'gridScene' + i);
        game.scenes.spawn('image', 'image' + i, false);

        i++;

    });
}
