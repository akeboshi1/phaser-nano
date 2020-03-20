import File from '../File';
import ImageTagLoader from '../ImageTagLoader';
import IFrameConfig from '../../textures/IFrameConfig';
import Game from '../../Game';
import GetURL from '../GetURL';
import SpriteSheetParser from '../../textures/SpriteSheetParser';

export default function SpriteSheetFile (game: Game, key: string, url: string, frameConfig: IFrameConfig): File
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

                const texture = game.textures.add(key, file.data);

                if (texture)
                {
                    SpriteSheetParser(texture, 0, 0, texture.width, texture.height, frameConfig);

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
