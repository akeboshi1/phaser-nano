export default function GetURL (key: string, url: string, extension: string)
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
        // return this.baseURL + this.path + url;
        return url;
    }
}
