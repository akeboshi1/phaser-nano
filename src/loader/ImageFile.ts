import File from './File';
import ImageTagLoader from './ImageTagLoader';
import Texture from '../textures/Texture';
import Game from '../Game';
import GetURL from './GetURL';

export default function ImageFile (game: Game, key: string, url?: string): Promise<Texture>
{
    const file = new File(key, GetURL(key, url, '.png'));

    return new Promise(
        (resolve, reject) => {

            ImageTagLoader(file).then(file => {

                resolve(game.textures.add(key, file.data));
    
            }).catch(file => {

                reject(null);
    
            });

        }
    );
}
