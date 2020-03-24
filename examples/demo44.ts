import Game from '../src/Game';
import Scene from '../src/Scene';
import Text from '../src/gameobjects/Text';

class Demo extends Scene
{
    constructor (game: Game)
    {
        super(game);

        const bob = new Text(this, 400, 300, 'Hello World');

        bob.setText('Bubble Bobble');

        this.world.addChild(bob);
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
