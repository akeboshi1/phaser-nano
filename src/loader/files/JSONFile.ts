import File from '../File';
import XHRLoader from '../XHRLoader';
import Game from '../../Game';
import GetURL from '../GetURL';

export default function JSONFile (game: Game, key: string, url?: string): File
{
    const file = new File(key, url);

    file.load = () => {

        file.url = GetURL(file.key, file.url, '.json', file.loader);

        return new Promise((resolve, reject) => {

            XHRLoader(file).then(file => {

                file.data = JSON.parse(file.data);

                if (!file.skipCache)
                {
                    game.cache.json.set(file.key, file.data);
                }

                resolve(file);
    
            }).catch(file => {

                reject(file);
    
            });
        });
    };

    return file;
}
