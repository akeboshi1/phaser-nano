import File from '../File';
import XHRLoader from '../XHRLoader';
import Game from '../../Game';
import GetURL from '../GetURL';

export default function CSVFile (game: Game, key: string, url?: string): File
{
    const file = new File(key, url);

    file.load = () => {

        file.url = GetURL(file.key, file.url, '.csv', file.loader);

        return new Promise((resolve, reject) => {

            XHRLoader(file).then(file => {

                if (!file.skipCache)
                {
                    game.cache.csv.set(file.key, file.data);
                }

                resolve(file);
    
            }).catch(file => {

                reject(file);
    
            });
        });
    };

    return file;
}
