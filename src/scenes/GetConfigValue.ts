import ISceneConfig from './ISceneConfig';

export default function GetConfigValue (config: ISceneConfig, property: string, defaultValue: any): any
{
    if (config.hasOwnProperty(property))
    {
        return config[property];
    }
    else
    {
        return defaultValue;
    }
}
