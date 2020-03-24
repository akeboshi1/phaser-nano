import File from '../File';
import XHRLoader from '../XHRLoader';
import Game from '../../Game';
import GetURL from '../GetURL';
import ParseXML from '../../core/ParseXML';

export default function XMLFile (game: Game, key: string, url?: string): File
{
    const file = new File(key, url);

    file.load = () => {

        file.url = GetURL(file.key, file.url, '.xml', file.loader);

        return new Promise((resolve, reject) => {

            XHRLoader(file).then(file => {

                const xml = ParseXML(file.data);

                if (xml !== null)
                {
                    file.data = xml;

                    if (!file.skipCache)
                    {
                        game.cache.xml.set(file.key, xml);
                    }

                    resolve(file);
                }
                else
                {
                    reject(file);
                }
    
            }).catch(file => {

                reject(file);
    
            });
        });
    };

    return file;
}
