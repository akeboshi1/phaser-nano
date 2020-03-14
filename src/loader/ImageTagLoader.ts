import File from './File';

export default function ImageTagLoader (file: File): Promise<File>
{
    file.data = new Image();

    if (file.crossOrigin)
    {
        file.data.crossOrigin = file.crossOrigin;
    }

    return new Promise(
        (resolve, reject) => {

            file.data.onload = () => {
                if (file.data.onload)
                {
                    file.data.onload = null;
                    file.data.onerror = null;
                    resolve(file);
                }
            };

            file.data.onerror = (event: ErrorEvent) => {
                if (file.data.onload)
                {
                    file.data.onload = null;
                    file.data.onerror = null;
                    file.error = event;
                    reject(file);
                }
            };

            file.data.src = file.url;

            // Image is immediately-available or cached

            if (file.data.complete && file.data.width && file.data.height)
            {
                file.data.onload = null;
                file.data.onerror = null;
                resolve(file);
            }
        }
    );
}
