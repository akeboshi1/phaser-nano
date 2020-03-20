import Loader from './Loader';

export default class File
{
    key: string;
    url: string;
    responseType: XMLHttpRequestResponseType = 'text';
    crossOrigin: string | undefined = undefined;
    data: any;
    error: ErrorEvent | undefined;
    config: any;
    skipCache: boolean = false;
    hasLoaded: boolean = false;
    loader: Loader;
    load: () => Promise<File>;

    constructor (key: string, url: string, config?: any)
    {
        this.key = key;
        this.url = url;
        this.config = config;
    }
}