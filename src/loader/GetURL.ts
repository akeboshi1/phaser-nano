import Loader from './Loader';

export default function GetURL (key: string, url: string, extension: string, loader?: Loader): string
{
    if (!url)
    {
        url = key + extension;
    }

    if (url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
    {
        return url;
    }
    else
    {
        if (loader)
        {
            return loader.baseURL + loader.path + url;
        }
        else
        {
            return url;
        }
    }
}
