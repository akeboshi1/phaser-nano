import File from './File';
import Game from '../Game';

export default class Loader
{
    game: Game;

    baseURL: string = '';
    path: string = '';
    crossOrigin: string = 'anonymous';

    //  -1 means load everything at once
    maxParallelDownloads: number = -1;

    isLoading: boolean = false;

    queue: Set<File>;
    inflight: Set<File>;

    onComplete: Function;

    constructor (game: Game)
    {
        this.game = game;

        this.reset();
    }

    reset ()
    {
        this.isLoading = false;

        this.queue = new Set();
        this.inflight = new Set();
    }

    add (...file: File[]): this
    {
        file.forEach((entity) => {

            entity.loader = this;

            this.queue.add(entity);
    
        });

        return this;
    }

    start (onComplete: Function)
    {
        if (this.isLoading)
        {
            return;
        }

        if (this.queue.size > 0)
        {
            this.isLoading = true;

            this.onComplete = onComplete;

            this.nextFile();
        }
        else
        {
            onComplete();
        }
    }

    nextFile ()
    {
        let limit = this.queue.size;

        if (this.maxParallelDownloads !== -1)
        {
            limit = Math.min(limit, this.maxParallelDownloads) - this.inflight.size;
        }

        if (limit)
        {
            // console.log('Batching', limit, 'files to download');

            const iterator = this.queue.values();

            while (limit > 0)
            {
                const file = iterator.next().value;

                // console.log('Loader.nextFile', file.key, '=>', file.url);
    
                this.inflight.add(file);
    
                this.queue.delete(file);
    
                file.load().then((file: File) => this.fileComplete(file)).catch((file: File) => this.fileError(file));

                limit--;
            }
        }
        else if (this.inflight.size === 0)
        {
            this.stop();
        }
    }

    stop ()
    {
        this.isLoading = false;

        this.onComplete();
    }

    private fileComplete (file: File)
    {
        this.inflight.delete(file);

        this.nextFile();
    }

    private fileError (file: File)
    {
        this.inflight.delete(file);

        this.nextFile();
    }

    totalFilesToLoad (): number
    {
        return this.queue.size + this.inflight.size;
    }

    setBaseURL (url: string = ''): this
    {
        if (url !== '' && url.substr(-1) !== '/')
        {
            url = url.concat('/');
        }

        this.baseURL = url;

        return this;
    }

    setPath (path: string = ''): this
    {
        if (path !== '' && path.substr(-1) !== '/')
        {
            path = path.concat('/');
        }

        this.path = path;

        return this;
    }

    setCORS (crossOrigin: string): this
    {
        this.crossOrigin = crossOrigin;

        return this;
    }

    setMaxParallelDownloads (max: number): this
    {
        this.maxParallelDownloads = max;

        return this;
    }
}
