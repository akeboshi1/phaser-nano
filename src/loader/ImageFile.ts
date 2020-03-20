import File from './File';
import ImageTagLoader from './ImageTagLoader';
import Game from '../Game';
import GetURL from './GetURL';

export default function ImageFile (game: Game, key: string, url?: string): File
{
    const file = new File(key, url);

    file.load = () => {

        file.url = GetURL(file.key, file.url, '.png', file.loader);

        if (file.loader)
        {
            file.crossOrigin = file.loader.crossOrigin;
        }

        return new Promise((resolve, reject) => {

                ImageTagLoader(file).then(file => {

                    game.textures.add(key, file.data);

                    resolve(file);
        
                }).catch(file => {

                    reject(file);

                });
            }
        );
    };

    return file;
}
