import DOMContentLoaded from './core/DOMContentLoaded';
import AddToDOM from './core/AddToDOM';
import WebGLRenderer from './renderer/WebGLRenderer';
import SceneManager from './scenes/SceneManager';
import TextureManager from './textures/TextureManager';
import IGameConfig from './IGameConfig';
import EventEmitter from './core/EventEmitter';

export default class Game extends EventEmitter
{
    VERSION: string = '4.0.0-beta1';

    config: IGameConfig;

    isPaused: boolean = false;
    isBooted: boolean = false;

    scenes: SceneManager;
    textures: TextureManager;
    renderer: WebGLRenderer;
    cache: { json: Map<string, any>; csv: Map<string, any>; xml: Map<string, any>; };

    private lastTick: number;
    lifetime: number = 0;
    elapsed: number = 0;

    //  The current game frame
    frame: number = 0;

    constructor (config?: IGameConfig)
    {
        super();

        const {
            width = 800,
            height = 600,
            resolution = 1,
            backgroundColor = 0x00000,
            parent = document.body,
            scene = null
        } = config;

        this.config = { width, height, resolution, backgroundColor, parent, scene };

        this.cache = {
            json: new Map(),
            csv: new Map(),
            xml: new Map()
        };

        DOMContentLoaded(() => this.boot());
    }

    pause ()
    {
        this.isPaused = true;

        this.emit('pause');
    }

    resume ()
    {
        this.isPaused = false;

        this.lastTick = Date.now();

        this.emit('resume');
    }

    boot ()
    {
        const config = this.config;

        this.isBooted = true;
        this.lastTick = Date.now();

        const renderer = new WebGLRenderer(config.width, config.height, config.resolution);

        renderer.setBackgroundColor(config.backgroundColor);

        AddToDOM(renderer.canvas, config.parent);

        this.renderer = renderer;
        this.textures = new TextureManager();
        this.scenes = new SceneManager(this);

        this.banner(this.VERSION);

        this.scenes.boot([].concat(config.scene));

        //  Visibility API
        document.addEventListener('visibilitychange', () => {

            this.emit('visibilitychange', document.hidden);

            if (document.hidden)
            {
                this.pause();
            }
            else
            {
                this.resume();
            }

        });

        // window.addEventListener('blur', () => this.pause());
        // window.addEventListener('focus', () => this.resume());

        this.emit('boot');

        requestAnimationFrame(() => this.step());
    }

    banner (version: string)
    {
        console.log(
            '%c %cPhaser Nano v' + version + '%c https://phaser4.io',
            'padding: 2px; background: linear-gradient(to right, #00bcc3, #3e0081)',
            'padding: 2px 20px 2px 8px; color: #fff; background: linear-gradient(to right, #3e0081 90%, #3e0081 10%, #00bcc3)',
            ''
        );

        //  Adds ~400 bytes to build size :(
        // console.log(
        //     '%c  %c  %cPhaser Nano v' + version + '%c https://phaser4.io',
        //     'padding: 2px; background: linear-gradient(to right, #00bcc3, #3e0081)',
        //     'padding: 2px; background: #3e0081 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJ1BMVEUALon///+9tJQAAABv9v92d2IAn6qHEhL/DQ3/fCUOOlNMPUD/uz24pItZAAAAaElEQVQI12OAA/YCKKPyOANbWgKQUdFZkOLiBmJ0zHIRdAEKWXR0uQimABnWu3elpIEYhoKCYS4ui8EModBQRQMG09AgQSBQBmpvBzOABhYpAYEBg3FpEJAOZgCqAdEGDAzGIACk4QAAsv0aPCHrnowAAAAASUVORK5CYII=) no-repeat;',
        //     'padding: 2px 20px 2px 8px; color: #fff; background: linear-gradient(to right, #3e0081 90%, #3e0081 10%, #00bcc3)',
        //     ''
        // );
    }

    step ()
    {
        const now = Date.now();
        const delta = now - this.lastTick;

        const dt = delta / 1000;

        this.lifetime += dt;
        this.elapsed = dt;
        this.lastTick = now;
    
        this.emit('step', dt, now);

        const sceneManager = this.scenes;

        if (!this.isPaused)
        {
            sceneManager.update(dt, now);
        }

        this.emit('update', dt, now);

        const totalDirty: number = sceneManager.render(this.frame);

        this.renderer.render(sceneManager.renderList, totalDirty);

        this.emit('render', dt, now);

        //  The frame always advances by 1 each step (even when paused)
        this.frame++;

        requestAnimationFrame(() => this.step());
    }

    destroy ()
    {
        //  TODO
    }

}
