import File from './File';
import ImageTagLoader from './ImageTagLoader';
import Texture from '../textures/Texture';
import IFrameConfig from '../textures/IFrameConfig';
import Game from '../Game';
import GetURL from './GetURL';
import SpriteSheetParser from '../textures/SpriteSheetParser';

export default function SpriteSheetFile (game: Game, key: string, url: string, frameConfig: IFrameConfig): Promise<Texture>
{
    const file = new File(key, GetURL(key, url, '.png'));

    return new Promise(
        (resolve, reject) => {

            ImageTagLoader(file).then(file => {

                const texture = game.textures.add(key, file.data);

                if (texture)
                {
                    SpriteSheetParser(texture, 0, 0, texture.width, texture.height, frameConfig);

                    resolve(texture);
                }
                else
                {
                    reject(null);
                }
    
            }).catch(file => {

                reject(null);
    
            });

        }
    );
}
