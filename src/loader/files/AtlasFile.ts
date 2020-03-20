import File from '../File';
import JSONFile from './JSONFile';
import ImageFile from './ImageFile';
import Game from '../../Game';
import AtlasParser from '../../textures/AtlasParser';
import GetURL from '../GetURL';

export default function AtlasFile (game: Game, key: string, textureURL?: string, atlasURL?: string): File
{
    const json = JSONFile(game, key, atlasURL);
    const image = ImageFile(game, key, textureURL);

    const file = new File(key, '');

    file.load = () => {

        //  If called via a Loader, it has been set into the file const
        json.url = GetURL(json.key, json.url, '.json', file.loader);
        image.url = GetURL(image.key, image.url, '.png', file.loader);

        return new Promise((resolve, reject) => {

            json.skipCache = true;

            json.load().then(() => {

                image.load().then(() => {

                    //  By this stage, the JSON and image are loaded and in the texture manager

                    AtlasParser(game.textures.get(key), json.data);

                    resolve(file);

                }).catch(() => {

                    reject(file);

                });

            }).catch(() => {

                reject(file);

            });
        });
    };

    return file;
}
