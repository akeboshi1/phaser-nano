export default class File
{
    type: string;
    key: string;
    url: string;
    crossOrigin: string | undefined = undefined;
    data: any;
    error: ErrorEvent | undefined;
    config: any;
    linkFile: File;

    loadHandler: Function;

    hasLoaded: boolean = false;

    // constructor (type: string, key: string, url: string, loadHandler: Function, config?: any)
    constructor (key: string, url: string, config?: any)
    {
        // this.type = type;
        this.key = key;
        this.url = url;
        // this.loadHandler = loadHandler;
        this.config = config;
    }
}